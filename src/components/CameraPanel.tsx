"use client";

import { useEffect, useState } from "react";
import { useMqtt } from "@/contexts/MQTTContext";

interface CameraPanelProps {
  cameraId: string;
  ip: string; // 👈 now pass IP of the ESP32-CAM
}

export default function CameraPanel({ cameraId, ip }: CameraPanelProps) {
  const { client, connectionStatus } = useMqtt();
  const [camStatus, setCamStatus] = useState<string>("Waiting for status...");

  useEffect(() => {
    if (!client) return;

    const statusTopic = `cam/${cameraId}/status`;

    const handleMessage = (topic: string, message: Buffer) => {
      if (topic === statusTopic) {
        setCamStatus(message.toString());
      }
    };

    client.subscribe(statusTopic);
    client.on("message", handleMessage);

    return () => {
      client.unsubscribe(statusTopic);
      client.removeListener("message", handleMessage);
    };
  }, [client, cameraId]);

  const handleCapture = () => {
    if (client && connectionStatus === "connected") {
      client.publish(`cam/${cameraId}/control`, "capture");
    }
  };

  return (
    <div className="border rounded shadow p-4">
      <h3 className="text-lg font-bold mb-2">Camera: {cameraId}</h3>

      <img
        src={`http://${ip}/stream`}
        alt={`Live feed from ${cameraId}`}
        className="w-full rounded mb-2"
      />

      <p className="text-sm text-gray-600 mb-2">Status: {camStatus}</p>

      <button
        onClick={handleCapture}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Capture
      </button>
    </div>
  );
}
