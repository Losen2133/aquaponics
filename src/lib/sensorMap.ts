import type { SensorData } from "@/interfaces/interfaces";

export const typeMap: Record<string, keyof SensorData> = {
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
  ultrasonic: "ultrasonic",
};

export const sensorKeys = Object.values(typeMap);