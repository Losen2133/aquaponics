export interface LightLevelResponse {
  sensor: string;
  value: number;
  light: number;
}

export interface SensorData {
  light?: { value: number; light: number; timestamp: number }
  waterTemp?: { value: number; timestamp: number }
  waterLevel?: { value: number; timestamp: number }
  pH?: { value: number; timestamp: number }
  dissolvedOxygen?: { value: number; timestamp: number }
  nutrientLevel?: { value: number; timestamp: number }
  airTemp?: { value: number; timestamp: number }
  humidity?: { value: number; timestamp: number }
  flowRate?: { value: number; timestamp: number }
}