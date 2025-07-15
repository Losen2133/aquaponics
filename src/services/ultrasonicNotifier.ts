// src/hooks/useUltrasonicNotifier.ts
import { toast } from "react-toastify";
import { useNotifications } from "@/contexts/notificationContext";

let lastAlertTime = 0;

export function useUltrasonicNotifier() {
  const { addNotification } = useNotifications();

  function handleUltrasonicData(payload: string) {
    try {
      const data = JSON.parse(payload);
      const distanceCm = parseFloat(data.value_cm);

      const now = Date.now();
      const nowStr = new Date(now).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      if (distanceCm < 10 && now - lastAlertTime > 10000) {
        const message = `⚠️ Motion Detected at ${nowStr}: Object is ${distanceCm.toFixed(1)} cm away`;

        toast.warning(message, {
          position: "top-right",
          autoClose: 5000,
        });

        addNotification(message);
        lastAlertTime = now;
      }
    } catch (err) {
      console.error("❌ Failed to parse ultrasonic data:", payload);
    }
  }

  return { handleUltrasonicData };
}
