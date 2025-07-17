"use client"

import { useState, useEffect } from "react"

interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  cloudCover: number
  uvIndex: number
  visibility: number
  description: string
  icon: string
  location: string
  timestamp: number
}

interface UseWeatherOptions {
  apiKey: string
  refreshInterval?: number // in milliseconds
  city?: string
  lat?: number
  lon?: number
}


export function useWeather({
  apiKey,
  refreshInterval = 600000, // 10 minutes
}: UseWeatherOptions) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)

      const city = "Cebu City, Philippines"
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`WeatherAPI error: ${response.status}`)
      }

      const data = await response.json()

      const weather: WeatherData = {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        windSpeed: data.current.wind_kph,
        cloudCover: data.current.cloud,
        uvIndex: data.current.uv,
        visibility: data.current.vis_km,
        description: data.current.condition.text,
        icon: "https:" + data.current.condition.icon,
        location: `${data.location.name}, ${data.location.country}`,
        timestamp: new Date(data.location.localtime).getTime(),
      }

      setWeatherData(weather)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, refreshInterval)
    return () => clearInterval(interval)
  }, [apiKey, refreshInterval])

  return {
    weatherData,
    loading,
    error,
    refetch: fetchWeather,
  }
}
