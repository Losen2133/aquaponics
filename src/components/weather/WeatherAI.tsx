import { useEffect, useRef, useState } from "react"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  cloudCover: number
  pressure: number
  description: string
}

interface Props {
  weatherData: WeatherData
}

function isWeatherDataEqual(a: WeatherData, b: WeatherData) {
  return (
    a.temperature === b.temperature &&
    a.humidity === b.humidity &&
    a.windSpeed === b.windSpeed &&
    a.cloudCover === b.cloudCover &&
    a.pressure === b.pressure &&
    a.description === b.description
  )
}

export default function AquaponicsAIAdvice({ weatherData }: Props) {
  const [aiAdvice, setAiAdvice] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const lastWeatherData = useRef<WeatherData | null>(null)

  useEffect(() => {
    // Only fetch if weather data actually changed
    if (lastWeatherData.current && isWeatherDataEqual(lastWeatherData.current, weatherData)) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const fetchAIAdvice = async () => {
      try {
        const prompt = `You're an aquaponics expert. Analyze the following weather data and give advice on how it might impact an aquaponics system. 
- Respond in 2-3 concise bullet points.
- Format your answer as valid HTML.
- Do not include any introductory or closing sentences, just the bullet points.
Weather data:
Temperature: ${weatherData.temperature}°C
Humidity: ${weatherData.humidity}%
Wind Speed: ${weatherData.windSpeed} km/h
Cloud Cover: ${weatherData.cloudCover}%
Pressure: ${weatherData.pressure} hPa
Description: ${weatherData.description}`

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
            "HTTP-Referer": "https://www.sitename.com",
            "X-Title": "SiteName",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        })

        const data = await response.json()
        const advice = data.choices?.[0]?.message?.content

        if (advice) {
          setAiAdvice(advice)
          setError(null)
          lastWeatherData.current = weatherData
        } else {
          setError("No advice received.")
        }
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAIAdvice()
  }, [weatherData])

  return (
    <div className="bg-green-50 rounded-lg p-3">
      {loading && !aiAdvice && <p className="text-gray-500 text-sm">Generating advice...</p>}
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      {!loading && !error && aiAdvice && (
        <div
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: aiAdvice }}
        />
      )}
      {/* Show last advice even if loading, unless error */}
      {loading && aiAdvice && !error && (
        <div
          className="text-sm text-gray-700 opacity-60"
          dangerouslySetInnerHTML={{ __html: aiAdvice }}
        />
      )}
    </div>
  )
}
