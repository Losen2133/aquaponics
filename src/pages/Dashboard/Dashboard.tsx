"use client"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import TitleSetter from "@/components/utilities/titlesetter"
import SensorCard from "@/components/SensorCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMqtt } from "@/contexts/MQTTContext"
import type { SensorData } from "@/interfaces/interfaces"

export default function Dashboard() {
  const { sensorData, connectionStatus, lastUpdate } = useMqtt()

  const getStatus = (value: number | undefined, min: number, max: number) => {
    if (value === undefined) return "normal"
    if (value < min || value > max) return "critical"
    if (value < min * 1.1 || value > max * 0.9) return "warning"
    return "normal"
  }

  const isConnected = (sensorType: keyof SensorData) => {
    const sensor = sensorData[sensorType]
    if (!sensor) return false
    const timeDiff = Date.now() - sensor.timestamp
    return timeDiff < 30000
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <TitleSetter title="Aquaponics Dashboard" />

      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Aquaponics Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring of your aquaponics system</p>
            </div>
            <div className="flex items-center gap-4">
              {/* <Badge variant={connectionStatus === "connected" ? "default" : "destructive"} className="gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                />
                {connectionStatus === "connected" ? "Connected" : "Disconnected"}
              </Badge> */}
              {lastUpdate && <p className="text-sm text-gray-500">Last update: {lastUpdate.toLocaleTimeString()}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-blue-500">📊</span>
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
                <div className={connectionStatus === "connected" ? "text-2xl font-bold text-green-600" : "text-2xl font-bold text-red-600"}>
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

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SensorCard
            title="Light Level"
            value={sensorData.light?.light ?? null}
            unit=" lux"
            icon={isConnected("light") ? <span className="text-2xl">💡</span> : null}
            isConnected={isConnected("light")}
            status={getStatus(sensorData.light?.light, 100, 1000)}
            description="Optimal: 200-800 lux"
            colorTheme="yellow"
          />

          <SensorCard
            title="Water Temperature"
            value={sensorData.waterTemp?.value ?? null}
            unit="°C"
            icon={isConnected("waterTemp") ? <span className="text-2xl">🌡️</span> : null}
            isConnected={isConnected("waterTemp")}
            status={getStatus(sensorData.waterTemp?.value, 18, 26)}
            description="Optimal: 20-24°C"
            colorTheme="blue"
          />

          <SensorCard
            title="Water Level"
            value={sensorData.waterLevel?.value ?? null}
            unit="%"
            icon={isConnected("waterLevel") ? <span className="text-2xl">💧</span> : null}
            isConnected={isConnected("waterLevel")}
            status={getStatus(sensorData.waterLevel?.value, 70, 100)}
            description="Optimal: 80-95%"
            colorTheme="cyan"
          />

          <SensorCard
            title="pH Level"
            value={sensorData.pH?.value ?? null}
            unit=""
            icon={isConnected("pH") ? <span className="text-2xl">🧪</span> : null}
            isConnected={isConnected("pH")}
            status={getStatus(sensorData.pH?.value, 6.0, 7.5)}
            description="Optimal: 6.5-7.0"
            colorTheme="green"
          />

          <SensorCard
            title="Dissolved Oxygen"
            value={sensorData.dissolvedOxygen?.value ?? null}
            unit=" mg/L"
            icon={isConnected("dissolvedOxygen") ? <span className="text-2xl">🌊</span> : null}
            isConnected={isConnected("dissolvedOxygen")}
            status={getStatus(sensorData.dissolvedOxygen?.value, 5, 15)}
            description="Optimal: 6-8 mg/L"
            colorTheme="teal"
          />

          <SensorCard
            title="Nutrient Level (EC)"
            value={sensorData.nutrientLevel?.value ?? null}
            unit=" mS/cm"
            icon={isConnected("nutrientLevel") ? <span className="text-2xl">⚡</span> : null}
            isConnected={isConnected("nutrientLevel")}
            status={getStatus(sensorData.nutrientLevel?.value, 1.2, 2.0)}
            description="Optimal: 1.4-1.8 mS/cm"
            colorTheme="purple"
          />

          <SensorCard
            title="Air Temperature"
            value={sensorData.airTemp?.value ?? null}
            unit="°C"
            icon={isConnected("airTemp") ? <span className="text-2xl">🌡️</span> : null}
            isConnected={isConnected("airTemp")}
            status={getStatus(sensorData.airTemp?.value, 18, 28)}
            description="Optimal: 20-25°C"
            colorTheme="orange"
          />

          <SensorCard
            title="Humidity"
            value={sensorData.humidity?.value ?? null}
            unit="%"
            icon={isConnected("humidity") ? <span className="text-2xl">💨</span> : null}
            isConnected={isConnected("humidity")}
            status={getStatus(sensorData.humidity?.value, 50, 80)}
            description="Optimal: 60-70%"
            colorTheme="indigo"
          />

          <SensorCard
            title="Water Flow Rate"
            value={sensorData.flowRate?.value ?? null}
            unit=" L/min"
            icon={isConnected("flowRate") ? <span className="text-2xl">📊</span> : null}
            isConnected={isConnected("flowRate")}
            status={getStatus(sensorData.flowRate?.value, 2, 8)}
            description="Optimal: 3-6 L/min"
            colorTheme="pink"
          />
        </div>
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  )
}
