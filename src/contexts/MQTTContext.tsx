"use client"

import { createContext, useContext, useEffect, useState } from "react"
import mqtt from "mqtt"
import type { MqttClient } from "mqtt" // <-- type-only import
import { handleUltrasonicData } from "@/services/ultrasonicNotifier"
import type { SensorData } from "@/interfaces/interfaces"

type MqttContextType = {
  client: MqttClient | null
  sensorData: SensorData
  connectionStatus: "connected" | "disconnected" | "connecting"
  lastUpdate: Date | null
}

const MqttContext = createContext<MqttContextType | undefined>(undefined)

export const useMqtt = () => {
  const context = useContext(MqttContext)
  if (!context) throw new Error("useMqtt must be used within MqttProvider")
  return context
}

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null)
  const [sensorData, setSensorData] = useState<SensorData>({} as SensorData) // ✅ Type assertion for empty object
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const brokerUrl = "ws://147.185.221.30:6067"
    const mqttClient = mqtt.connect(brokerUrl)

    setClient(mqttClient)

    mqttClient.on("connect", () => {
      setConnectionStatus("connected")

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
        "sensor/ultrasonic/#"
      ]

      topics.forEach((topic) => {
        mqttClient.subscribe(topic)
      })
    })

    mqttClient.on("message", (topic, message) => {
      const parts = topic.split("/")
      const type = parts[1]

      if (type === "ultrasonic") {
        handleUltrasonicData(message.toString())
        return
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
        "flow-rate": "flowRate"
      }

      const mapped = typeMap[type]
      if (!mapped) return

      try {
        const parsed = JSON.parse(message.toString())
        setSensorData((prev) => ({
          ...prev,
          [mapped]: {
            ...parsed,
            timestamp: Date.now()
          }
        }))
        setLastUpdate(new Date())
      } catch (err) {
        console.error("Invalid JSON from", topic, message.toString())
      }
    })

    mqttClient.on("close", () => setConnectionStatus("disconnected"))
    mqttClient.on("error", () => setConnectionStatus("disconnected"))

    return () => {
      mqttClient.end()
    }
  }, [])

  return (
    <MqttContext.Provider value={{ client, sensorData, connectionStatus, lastUpdate }}>
      {children}
    </MqttContext.Provider>
  )
}