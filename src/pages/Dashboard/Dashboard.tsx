import { useEffect, useState } from "react";
import mqtt from "mqtt";
import TitleSetter from "@/components/utilities/titlesetter";
import LightLevel from "@/components/LightLevel";
import type { LightLevelResponse } from "@/interfaces/interfaces";

const Dashboard = () => {
  const [data, setData] = useState<LightLevelResponse | null>(null);

  useEffect(() => {
    // Replace this with the actual Orange Pi IP
    const brokerUrl = "ws://localhost:9001"; // MQTT over WebSocket

    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      console.log("✅ MQTT connected");

      // Subscribe to all LDR sensors
      client.subscribe("sensor/ldr/#", (err) => {
        if (err) {
          console.error("❌ Failed to subscribe:", err);
        } else {
          console.log("📡 Subscribed to sensor/ldr/#");
        }
      });
    });

    client.on("message", (topic, message) => {
      try {
        const deviceId = topic.split("/")[2]; // sensor/ldr/<deviceId>
        const json: LightLevelResponse = JSON.parse(message.toString());
        console.log(`Message from ${deviceId}:`, json);
        setData(json);
      } catch (err) {
        console.error("❌ Invalid JSON received:", message.toString());
      }
    });


    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
    });

    client.on("close", () => {
      console.warn("🔌 MQTT connection closed");
    });

    return () => {
      client.end();
    };
  }, []);

  const isBright = data ? data.light >= 5 : false;

  return (
    <div className="min-h-screen font-sans antialiased">
      <TitleSetter title="Dashboard" />
      <main className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
        <p className="mb-4 text-xl font-semibold">This is the Dashboard</p>
        {data && (
          <LightLevel
            isBright={isBright}
            value={data.value}
            light={data.light}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
