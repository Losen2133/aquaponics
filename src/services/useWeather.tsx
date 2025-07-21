"use client"

import WeatherCard from "@/components/weather/WeatherCard"

interface WeatherWidgetProps {
  apiKey: string
  city?: string
  lat?: number
  lon?: number
  className?: string
}

export default function WeatherWidget(props: WeatherWidgetProps) {
  return <WeatherCard {...props} />
}
