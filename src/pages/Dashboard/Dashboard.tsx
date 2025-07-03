import { useEffect, useState } from "react";
import TitleSetter from "@/components/utilities/titlesetter";
import LightLevel from "@/components/LightLevel";
import type { LightLevelResponse } from "@/interfaces/interfaces";

const Dashboard = () => {
  const [data, setData] = useState<LightLevelResponse | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.93.240/ws");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message: LightLevelResponse = JSON.parse(event.data);
        // console.log("WebSocket LDR Data:", message);
        setData(message);
      } catch (err) {
        // console.error("Invalid WebSocket JSON:", event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.warn("WebSocket connection closed");
    };

    return () => {
      ws.close();
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
