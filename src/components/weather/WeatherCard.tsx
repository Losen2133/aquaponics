"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeather } from "@/contexts/WeatherContext"
import AquaponicsAIAdvice  from "@/components/weather/WeatherAI"

interface WeatherCardProps {
  apiKey: string
  city?: string
  lat?: number
  lon?: number
  className?: string
}

const getTemperatureStatus = (temp: number) => {
  if (temp < 15) return { status: "cold", color: "bg-blue-500" }
  if (temp > 30) return { status: "hot", color: "bg-red-500" }
  return { status: "optimal", color: "bg-green-500" }
}

export default function WeatherCard({ apiKey, city, lat, lon, className = "" }: WeatherCardProps) {
  const { weatherData, loading, error } = useWeather({
    apiKey,
    city,
    lat,
    lon,
  })

  if (loading) {
    return (
      <Card className={`bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🌤️</span>
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-600 font-medium">Weather data unavailable</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) return null

  const tempStatus = getTemperatureStatus(weatherData.temperature)

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={weatherData.icon} alt="icon" className="w-8 h-8" />
            Weather Conditions
          </div>
          <Badge variant="outline" className="text-xs">
            {weatherData.location}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Temperature Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-gray-900">{weatherData.temperature}°C</span>
            <div className={`w-3 h-3 rounded-full ${tempStatus.color}`} />
          </div>
          <p className="text-sm text-gray-600 capitalize mt-1">{weatherData.description}</p>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">💧</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Humidity</p>
                <p className="text-lg font-bold text-blue-600">{weatherData.humidity}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌪️</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Wind Speed</p>
                <p className="text-lg font-bold text-gray-600">{(weatherData.windSpeed / 3.6).toFixed(1)} m/s</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Pressure</p>
                <p className="text-lg font-bold text-purple-600">{weatherData.pressure} hPa</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">☁️</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Cloud Cover</p>
                <p className="text-lg font-bold text-yellow-600">{weatherData.cloudCover}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact on Aquaponics: implement ai to do this */}
        <div className="bg-green-50 rounded-lg p-3">
          <h4 className="font-medium text-green-800 mb-2">Aquaponics Impact</h4>
          <div className="space-y-1 text-sm">
            <AquaponicsAIAdvice weatherData={weatherData} />

          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(weatherData.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
