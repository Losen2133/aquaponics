"use client"

import { useEffect, useState } from "react"
import mqtt from "mqtt"
import TitleSetter from "@/components/utilities/titlesetter"
import SensorCard from "@/components/SensorCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Thermometer, Droplets, Activity, Zap, Wind, Gauge, FlaskConical, Waves } from "lucide-react"

interface SensorData {
  light?: { value: number; light: number; timestamp: Date }
  waterTemp?: { value: number; timestamp: Date }
  waterLevel?: { value: number; timestamp: Date }
  pH?: { value: number; timestamp: Date }
  dissolvedOxygen?: { value: number; timestamp: Date }
  nutrientLevel?: { value: number; timestamp: Date }
  airTemp?: { value: number; timestamp: Date }
  humidity?: { value: number; timestamp: Date }
  flowRate?: { value: number; timestamp: Date }
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({})
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const brokerUrl = "ws://localhost:9001"
    const client = mqtt.connect(brokerUrl)

    client.on("connect", () => {
      console.log("✅ MQTT connected")
      setConnectionStatus("connected")

      // Subscribe to all sensor topics
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
      ]

      topics.forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`❌ Failed to subscribe to ${topic}:`, err)
          } else {
            console.log(`📡 Subscribed to ${topic}`)
          }
        })
      })
    })

    client.on("message", (topic, message) => {
      try {
        const topicParts = topic.split("/")
        const sensorType = topicParts[1]
        const data = JSON.parse(message.toString())

        setSensorData((prev) => ({
          ...prev,
          [sensorType.replace("-", "")]: {
            ...data,
            timestamp: new Date(),
          },
        }))

        setLastUpdate(new Date())
      } catch (err) {
        console.error("❌ Invalid JSON received:", message.toString())
      }
    })

    client.on("error", (err) => {
      console.error("MQTT connection error:", err)
      setConnectionStatus("disconnected")
    })

    client.on("close", () => {
      console.warn("🔌 MQTT connection closed")
      setConnectionStatus("disconnected")
    })

    return () => {
      client.end()
    }
  }, [])

  const getStatus = (value: number | undefined, min: number, max: number) => {
    if (value === undefined) return "normal"
    if (value < min || value > max) return "critical"
    if (value < min * 1.1 || value > max * 0.9) return "warning"
    return "normal"
  }

  const isConnected = (sensorType: keyof SensorData) => {
    const sensor = sensorData[sensorType]
    if (!sensor) return false
    const timeDiff = new Date().getTime() - sensor.timestamp.getTime()
    return timeDiff < 30000 // Consider connected if data is less than 30 seconds old
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <TitleSetter title="Aquaponics Dashboard" />

      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aquaponics Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Real-time monitoring of your aquaponics system</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={connectionStatus === "connected" ? "default" : "destructive"} className="gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                />
                {connectionStatus === "connected" ? "Connected" : "Disconnected"}
              </Badge>
              {lastUpdate && <p className="text-sm text-gray-500">Last update: {lastUpdate.toLocaleTimeString()}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* System Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(sensorData).filter((sensor) => sensor).length}
                </div>
                <div className="text-sm text-gray-600">Active Sensors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {connectionStatus === "connected" ? "Online" : "Offline"}
                </div>
                <div className="text-sm text-gray-600">System Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{lastUpdate ? "Live" : "Waiting"}</div>
                <div className="text-sm text-gray-600">Data Stream</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SensorCard
            title="Light Level"
            value={sensorData.light?.light}
            unit=" lux"
            icon={<Lightbulb className="h-4 w-4" />}
            isConnected={isConnected("light")}
            status={getStatus(sensorData.light?.light, 100, 1000)}
            description="Optimal: 200-800 lux"
          />

          <SensorCard
            title="Water Temperature"
            value={sensorData.waterTemp?.value}
            unit="°C"
            icon={<Thermometer className="h-4 w-4" />}
            isConnected={isConnected("waterTemp")}
            status={getStatus(sensorData.waterTemp?.value, 18, 26)}
            description="Optimal: 20-24°C"
          />

          <SensorCard
            title="Water Level"
            value={sensorData.waterLevel?.value}
            unit="%"
            icon={<Droplets className="h-4 w-4" />}
            isConnected={isConnected("waterLevel")}
            status={getStatus(sensorData.waterLevel?.value, 70, 100)}
            description="Optimal: 80-95%"
          />

          <SensorCard
            title="pH Level"
            value={sensorData.pH?.value}
            unit=""
            icon={<FlaskConical className="h-4 w-4" />}
            isConnected={isConnected("pH")}
            status={getStatus(sensorData.pH?.value, 6.0, 7.5)}
            description="Optimal: 6.5-7.0"
          />

          <SensorCard
            title="Dissolved Oxygen"
            value={sensorData.dissolvedOxygen?.value}
            unit=" mg/L"
            icon={<Waves className="h-4 w-4" />}
            isConnected={isConnected("dissolvedOxygen")}
            status={getStatus(sensorData.dissolvedOxygen?.value, 5, 15)}
            description="Optimal: 6-8 mg/L"
          />

          <SensorCard
            title="Nutrient Level (EC)"
            value={sensorData.nutrientLevel?.value}
            unit=" mS/cm"
            icon={<Zap className="h-4 w-4" />}
            isConnected={isConnected("nutrientLevel")}
            status={getStatus(sensorData.nutrientLevel?.value, 1.2, 2.0)}
            description="Optimal: 1.4-1.8 mS/cm"
          />

          <SensorCard
            title="Air Temperature"
            value={sensorData.airTemp?.value}
            unit="°C"
            icon={<Thermometer className="h-4 w-4" />}
            isConnected={isConnected("airTemp")}
            status={getStatus(sensorData.airTemp?.value, 18, 28)}
            description="Optimal: 20-25°C"
          />

          <SensorCard
            title="Humidity"
            value={sensorData.humidity?.value}
            unit="%"
            icon={<Wind className="h-4 w-4" />}
            isConnected={isConnected("humidity")}
            status={getStatus(sensorData.humidity?.value, 50, 80)}
            description="Optimal: 60-70%"
          />

          <SensorCard
            title="Water Flow Rate"
            value={sensorData.flowRate?.value}
            unit=" L/min"
            icon={<Gauge className="h-4 w-4" />}
            isConnected={isConnected("flowRate")}
            status={getStatus(sensorData.flowRate?.value, 2, 8)}
            description="Optimal: 3-6 L/min"
          />
        </div>
      </main>
    </div>
  )
}
