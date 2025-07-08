import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface SensorCardProps {
  title: string
  value: string | number | null
  unit: string
  icon: React.ReactNode
  isConnected: boolean
  status?: "normal" | "warning" | "critical"
  description?: string
}

export default function SensorCard({
  title,
  value,
  unit,
  icon,
  isConnected,
  status = "normal",
  description,
}: SensorCardProps) {
  const getStatusColor = () => {
    if (!isConnected) return "text-muted-foreground"
    switch (status) {
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-green-600"
    }
  }

  const getStatusBadge = () => {
    if (!isConnected) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Module Not Detected
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
        <CheckCircle className="h-3 w-3" />
        Connected
      </Badge>
    )
  }

  return (
    <Card className={`transition-all duration-200 ${!isConnected ? "opacity-60" : "hover:shadow-md"}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full bg-muted ${getStatusColor()}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${getStatusColor()}`}>
            {isConnected && value !== null ? `${value}${unit}` : "--"}
          </div>
          {getStatusBadge()}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
