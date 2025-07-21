"use client";

import { createContext, useContext, useEffect, useState } from "react";
import mqtt from "mqtt";
import type { MqttClient } from "mqtt";
import type { SensorData } from "@/interfaces/interfaces";
import { handleUltrasonicData } from "@/services/ultrasonicNotifier";
import { useNotifications } from "@/contexts/notificationContext";

type MqttContextType = {
  client: MqttClient | null;
  sensorData: SensorData;
  connectionStatus: "connected" | "disconnected" | "connecting";
  lastUpdate: Date | null;
  discoveredCameras: DiscoveredCamera[];
};

type DiscoveredCamera = {
  id: string;
  ip: string;
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) throw new Error("useMqtt must be used within MqttProvider");
  return context;
};

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [sensorData, setSensorData] = useState<SensorData>({} as SensorData);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [discoveredCameras, setDiscoveredCameras] = useState<DiscoveredCamera[]>([]);

  const { addNotification } = useNotifications();

  useEffect(() => {
    const brokerUrl = "ws://192.168.254.187:6067";
    const mqttClient = mqtt.connect(brokerUrl);
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      console.log("✅ MQTT connected");
      setConnectionStatus("connected");

      const topics = [
        "sensor/ldr/#",
        "sensor/water-temp/#",
        "sensor/water-level/#",
        "sensor/ph/#",
        "sensor/dissolved-oxygen/#",
        "sensor/nutrient-level/#",
        "sensor/air-temp/#",
        "sensor/humidity/#",
        "sensor/flow-rate/#",
        "sensor/ultrasonic/#",
        "cam/image/#",

        // ✅ Subscribe to dynamic camera IPs
        "cam/+/ip",
      ];

      topics.forEach((topic) => mqttClient.subscribe(topic));
    });

    mqttClient.on("message", (topic, message) => {
      console.log(`[MQTT] Topic: ${topic}, Payload: ${message.toString()}`);
      const parts = topic.split("/");
      const type = parts[1];

      // ✅ Handle discovered camera IPs
      if (topic.startsWith("cam/") && topic.endsWith("/ip")) {
        const id = parts[1]; // e.g., "cam1"
        const ip = message.toString();

        setDiscoveredCameras((prev) => {
          const exists = prev.find((cam) => cam.id === id);
          const updated = exists
            ? prev.map((cam) => (cam.id === id ? { ...cam, ip } : cam))
            : [...prev, { id, ip }];

          console.log("📷 Updated discovered cameras:", updated);
          return updated;
        });

        return;
      }

      if (type === "ultrasonic") {
        try {
          const data = JSON.parse(message.toString());
          const distance = parseFloat(data.value_cm);
          const now = Date.now();

          setSensorData((prev) => ({
            ...prev,
            ultrasonic: {
              distance,
              timestamp: now,
            },
          }));
          setLastUpdate(new Date(now));

          handleUltrasonicData(message.toString(), addNotification);
        } catch (err) {
          console.error("❌ Invalid ultrasonic JSON:", message.toString());
        }
        return;
      }

      const typeMap: Record<string, keyof SensorData> = {
        ldr: "light",
        "water-temp": "waterTemp",
        "water-level": "waterLevel",
        ph: "pH",
        "dissolved-oxygen": "dissolvedOxygen",
        "nutrient-level": "nutrientLevel",
        "air-temp": "airTemp",
        humidity: "humidity",
        "flow-rate": "flowRate",
        cam: "cameraStatus",
      };

      const mapped = typeMap[type];
      if (!mapped) return;

      try {
        const parsed = JSON.parse(message.toString());
        setSensorData((prev) => ({
          ...prev,
          [mapped]: {
            ...parsed,
            timestamp: Date.now(),
          },
        }));
        setLastUpdate(new Date());
      } catch (err) {
        console.error("❌ Invalid JSON:", topic, message.toString());
      }
    });

    mqttClient.on("close", () => {
      console.warn("MQTT connection closed");
      setConnectionStatus("disconnected");
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT connection error:", err);
      setConnectionStatus("disconnected");
    });

    return () => {
      mqttClient.end();
    };
  }, [addNotification]);

  return (
    <MqttContext.Provider value={{ client, sensorData, connectionStatus, lastUpdate, discoveredCameras }}>
      {children}
    </MqttContext.Provider>
  );
};
