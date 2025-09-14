"use client";

import { createContext, useContext, useEffect, useState } from "react";
import mqtt from "mqtt";
import type { MqttClient } from "mqtt";
import type { SensorData } from "@/interfaces/interfaces";

type OfflineEvent = {
  sensor: string;
  wentOfflineAt: Date;
  cameOnlineAt?: Date;
};

type MqttContextType = {
  client: MqttClient | null;
  sensorData: SensorData;
  connectionStatus: "connected" | "disconnected" | "connecting";
  lastUpdate: Date | null;
  sensorNames: string[];
  offlineEvents: OfflineEvent[];
  onlineStatus: Record<string, boolean>;
  discoveredCameras: { id: string; ip: string }[];
};

const SENSOR_KEYS: (keyof SensorData)[] = [
  "light",
  "waterTemp",
  "waterLevel",
  "pH",
  "dissolvedOxygen",
  "nutrientLevel",
  "airTemp",
  "humidity",
  "flowRate",
  "ultrasonic",
];

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) throw new Error("useMqtt must be used within MqttProvider");
  return context;
};

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null);

  // Initialize sensorData with all keys to avoid undefined checks
  const [sensorData, setSensorData] = useState<SensorData>(() => {
    const initial: any = {};
    SENSOR_KEYS.forEach((key) => {
      initial[key] = undefined;
    });
    return initial;
  });
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [offlineEvents, setOfflineEvents] = useState<OfflineEvent[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SENSOR_KEYS.forEach((key) => {
      initial[key] = false;
    });
    return initial;
  });

  // Camera discovery state
  const [discoveredCameras, setDiscoveredCameras] = useState<{ id: string; ip: string }[]>([]);

  useEffect(() => {
    const brokerUrl = import.meta.env.VITE_BROKER_URL;
    const mqttClient = mqtt.connect(brokerUrl);
    setClient(mqttClient);

    mqttClient.on("connect", () => {
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
        "cam/+/ip", // subscribe to camera IP announcements
      ];
      topics.forEach((topic) => mqttClient.subscribe(topic));
    });

    mqttClient.on("message", (topic, message) => {
      const parts = topic.split("/");
      const type = parts[1];

      // Camera IP discovery
      if (parts[0] === "cam" && parts[2] === "ip") {
        const camId = parts[1];
        const ip = message.toString();
        setDiscoveredCameras((prev) => {
          // Avoid duplicates, update IP if already exists
          const existing = prev.find((c) => c.id === camId);
          if (existing) {
            return prev.map((c) => c.id === camId ? { id: camId, ip } : c);
          }
          return [...prev, { id: camId, ip }];
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

          handleUltrasonicData(message.toString());
        } catch (err) {
          console.error("Invalid ultrasonic JSON:", message.toString());
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
        console.error("Invalid JSON from", topic, message.toString());
      }
    });

    mqttClient.on("close", () => setConnectionStatus("disconnected"));
    mqttClient.on("error", () => setConnectionStatus("disconnected"));

    return () => {
      mqttClient.end();
    };
  }, []);

  // Track online/offline status and log events
  useEffect(() => {
    const now = Date.now();
    const newStatus: Record<string, boolean> = {};
    SENSOR_KEYS.forEach((key) => {
      const sensor = sensorData[key];
      newStatus[key] = sensor ? now - sensor.timestamp < 30000 : false;
    });

    // Detect changes and log events
    SENSOR_KEYS.forEach((sensor) => {
      const wasOnline = onlineStatus[sensor];
      const isOnline = newStatus[sensor];

      // Went offline
      if (wasOnline && !isOnline) {
        setOfflineEvents((prev) => [
          ...prev,
          { sensor, wentOfflineAt: new Date() },
        ]);
      }
      // Came online
      if (!wasOnline && isOnline) {
        setOfflineEvents((prev) => {
          // Find the last event for this sensor without a cameOnlineAt
          const idx = [...prev].reverse().findIndex(
            (e) => e.sensor === sensor && !e.cameOnlineAt
          );
          if (idx !== -1) {
            // Reverse index, so convert to actual index
            const actualIdx = prev.length - 1 - idx;
            const updated = [...prev];
            updated[actualIdx] = {
              ...updated[actualIdx],
              cameOnlineAt: new Date(),
            };
            return updated;
          }
          return prev;
        });
      }
    });

    setOnlineStatus(newStatus);
  }, [sensorData]);

  return (
    <MqttContext.Provider
      value={{
        client,
        sensorData,
        connectionStatus,
        lastUpdate,
        sensorNames: SENSOR_KEYS.map((k) => k.toString()),
        offlineEvents,
        onlineStatus,
  discoveredCameras,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

function handleUltrasonicData(arg0: string) {
  // Implement your logic here if needed
}
