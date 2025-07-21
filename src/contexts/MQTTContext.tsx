"use client";

import { createContext, useContext, useEffect, useState } from "react";
import mqtt from "mqtt";
import type { SensorData } from "@/interfaces/interfaces";
import { handleUltrasonicData } from "@/services/ultrasonicNotifier";
import { useNotifications } from "@/contexts/notificationContext";
import { typeMap } from "@/lib/sensorMap";

type DiscoveredCamera = {
  id: string;
  ip: string;
  lastSeen: number;
};

type MqttContextType = {
  client: ReturnType<typeof mqtt.connect> | null;
  sensorData: SensorData;
  connectionStatus: "connected" | "disconnected" | "connecting";
  lastUpdate: Date | null;
  discoveredCameras: DiscoveredCamera[];
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) throw new Error("useMqtt must be used within MqttProvider");
  return context;
};

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<ReturnType<typeof mqtt.connect> | null>(null);
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [discoveredCameras, setDiscoveredCameras] = useState<DiscoveredCamera[]>([]);

  const { addNotification } = useNotifications();

  // Modular sensor handlers
  const sensorHandlers: Record<string, (message: Buffer) => void> = {
    ultrasonic: (message) => {
      try {
        const data = JSON.parse(message.toString());
        const distance = parseFloat(data.value_cm);
        const now = Date.now();
        setSensorData((prev) => ({
          ...prev,
          ultrasonic: { distance, timestamp: now },
        }));
        setLastUpdate(new Date(now));
        handleUltrasonicData(message.toString(), addNotification);
      } catch (err) {
        console.error("Invalid ultrasonic JSON:", message.toString());
      }
    },
    // Add more handlers as needed
  };

  useEffect(() => {
    const brokerUrl = "ws://192.168.254.187:6067";
    const mqttClient = mqtt.connect(brokerUrl);

    setClient(mqttClient);

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
      "cam/+/ip",
    ];

    mqttClient.on("connect", () => {
      setConnectionStatus("connected");
      topics.forEach((topic) => mqttClient.subscribe(topic));
    });

    mqttClient.on("message", (topic: string, message: Buffer) => {
      const parts = topic.split("/");
      const type = parts[1];

      // Camera IP handler
      if (topic.startsWith("cam/") && topic.endsWith("/ip")) {
        const id = parts[1];
        const ip = message.toString();
        setDiscoveredCameras((prev) => {
          const now = Date.now();
          const exists = prev.find((cam) => cam.id === id);
          const updated = exists
            ? prev.map((cam) =>
                cam.id === id ? { ...cam, ip, lastSeen: now } : cam
              )
            : [...prev, { id, ip, lastSeen: now }];
          return updated;
        });
        setSensorData((prev) => ({
          ...prev,
          cameraStatus: {
            status: "online",
            timestamp: Date.now(),
          },
        }));
        return;
      }

      // Modular sensor handlers
      if (sensorHandlers[type]) {
        sensorHandlers[type](message);
        return;
      }

      // Generic handler for other sensors
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
        console.error("Invalid JSON:", topic, message.toString());
      }
    });

    mqttClient.on("close", () => {
      setConnectionStatus("disconnected");
    });

    mqttClient.on("error", (err: Error) => {
      console.error("MQTT connection error:", err);
      setConnectionStatus("disconnected");
    });

    return () => {
      mqttClient.end(true);
      setClient(null);
    };
  }, [addNotification]);

  return (
    <MqttContext.Provider value={{ client, sensorData, connectionStatus, lastUpdate, discoveredCameras }}>
      {children}
    </MqttContext.Provider>
  );
};
