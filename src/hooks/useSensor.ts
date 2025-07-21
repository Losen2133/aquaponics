import { useMqtt } from "@/contexts/MQTTContext";
import type { SensorData } from "@/interfaces/interfaces";

export function useSensor<T extends keyof SensorData>(key: T) {
  const { sensorData } = useMqtt();
  return sensorData[key];
}