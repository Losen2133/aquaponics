"use client"

import { useState } from "react"
import WeatherHeader from "./weather/WeatherHeader"
import WeatherCard from "./weather/WeatherCard"
import { motion, AnimatePresence } from "framer-motion"

interface ExpandableWeatherProps {
  apiKey: string
  city?: string
  lat?: number
  lon?: number
  className?: string
}

export default function ExpandableWeather({
  apiKey,
  city,
  lat,
  lon,
  className = "",
}: ExpandableWeatherProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <WeatherHeader
        apiKey={apiKey}
        city={city}
        lat={lat}
        lon={lon}
        onClick={() => setExpanded(!expanded)}
      />

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2"
          >
            <WeatherCard
              apiKey={apiKey}
              city={city}
              lat={lat}
              lon={lon}
              className="w-[320px]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
