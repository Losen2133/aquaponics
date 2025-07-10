// src/services/ultrasonicNotifier.ts

import { toast } from "react-toastify"

let lastAlertTime = 0

export function handleUltrasonicData(payload: string) {
  try {
    const data = JSON.parse(payload)
    const distanceCm = parseFloat(data.value_cm)

    const now = Date.now()
    if (distanceCm < 10 && now - lastAlertTime > 10000) {
      toast.warning(`⚠️ Motion Detected: Object is ${distanceCm.toFixed(1)} cm away`, {
        position: "top-right",
        autoClose: 5000,
      })
      lastAlertTime = now
    }
  } catch (err) {
    console.error("❌ Failed to parse ultrasonic data:", payload)
  }
}
