"use client"


import { useWeather } from "@/contexts/WeatherContext"

interface WeatherHeaderProps {
  apiKey: string
  city?: string
  lat?: number
  lon?: number
  className?: string
  onClick?: () => void
}

export default function WeatherHeader({
  apiKey,
  city,
  lat,
  lon,
  className = "",
  onClick,
}: WeatherHeaderProps) {
  const { weatherData, loading, error } = useWeather({ apiKey, city, lat, lon })

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`} onClick={onClick}>
        <span className="animate-pulse">🌤️</span>
        <span>Loading...</span>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className={`flex items-center gap-2 text-red-500 ${className}`} onClick={onClick}>
        <span>⚠️</span>
        <span>Weather unavailable</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 text-gray-700 cursor-pointer ${className}`} onClick={onClick}>
      <img src={weatherData.icon} alt="icon" className="w-6 h-6" />
      <span className="font-semibold">{weatherData.temperature}°C</span>
      <span className="text-xs text-gray-500">{weatherData.description}</span>
      <span className="text-xs text-gray-400">| {weatherData.location}</span>
    </div>
  )
}
