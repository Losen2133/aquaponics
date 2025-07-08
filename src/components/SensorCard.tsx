import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SensorCardProps {
  title: string
  value: string | number | null
  unit: string
  icon: React.ReactNode
  isConnected: boolean
  status?: "normal" | "warning" | "critical"
  description?: string
  colorTheme?: "blue" | "green" | "purple" | "orange" | "cyan" | "pink" | "indigo" | "teal" | "yellow"
}

export default function SensorCard({
  title,
  value,
  unit,
  icon,
  isConnected,
  status = "normal",
  description,
  colorTheme = "blue",
}: SensorCardProps) {
  const getStatusColor = () => {
    if (!isConnected) return "text-gray-400"
    switch (status) {
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return getThemeColors().text
    }
  }

  const getThemeColors = () => {
    const themes = {
      blue: {
        border: "border-blue-300",
        bg: "bg-blue-50",
        text: "text-blue-600",
        iconBg: "bg-blue-100",
      },
      green: {
        border: "border-green-300",
        bg: "bg-green-50",
        text: "text-green-600",
        iconBg: "bg-green-100",
      },
      purple: {
        border: "border-purple-300",
        bg: "bg-purple-50",
        text: "text-purple-600",
        iconBg: "bg-purple-100",
      },
      orange: {
        border: "border-orange-300",
        bg: "bg-orange-50",
        text: "text-orange-600",
        iconBg: "bg-orange-100",
      },
      cyan: {
        border: "border-cyan-300",
        bg: "bg-cyan-50",
        text: "text-cyan-600",
        iconBg: "bg-cyan-100",
      },
      pink: {
        border: "border-pink-300",
        bg: "bg-pink-50",
        text: "text-pink-600",
        iconBg: "bg-pink-100",
      },
      indigo: {
        border: "border-indigo-300",
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        iconBg: "bg-indigo-100",
      },
      teal: {
        border: "border-teal-300",
        bg: "bg-teal-50",
        text: "text-teal-600",
        iconBg: "bg-teal-100",
      },
      yellow: {
        border: "border-yellow-300",
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        iconBg: "bg-yellow-100",
      },
      grey: {
        border: "border-gray-300",
        bg: "bg-gray-50",
        text: "text-gray-600",
        iconBg: "bg-gray-100",
      },
    }
    return themes[colorTheme]
  }

  const getStatusBadge = () => {
    if (!isConnected) {
      return (
        <Badge variant="secondary" className="gap-1 text-gray-500 border-gray-300">
          <span className="text-red-500">⚠</span>
          Module Not Detected
        </Badge>
        
      )
    }
    return (
      <Badge variant="outline" className={`gap-1 ${getThemeColors().text} ${getThemeColors().border}`}>
        <span className="text-green-500">✓</span>
        Connected
      </Badge>
    )
  }

  const theme = isConnected
  ? getThemeColors()
  : {
      border: "border-gray-300",
      bg: "bg-gray-50",
      text: "text-gray-600",
      iconBg: "bg-gray-100",
    }

  return (
    <Card
      className={`transition-all duration-200 border-2 ${theme.border} ${theme.bg} ${
        !isConnected ? "opacity-60" : "hover:shadow-lg hover:scale-105"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-3 rounded-full ${theme.iconBg} ${getStatusColor()}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className={`text-3xl font-bold ${getStatusColor()}`}>
            {isConnected && value !== null ? `${value}${unit}` : "--"}
          </div>
          {getStatusBadge()}
          {description && <p className="text-xs text-gray-600 font-medium">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
