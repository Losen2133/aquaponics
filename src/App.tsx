import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { MqttProvider } from '@/contexts/MQTTContext'
import { NotificationProvider } from "@/contexts/notificationContext"

export default function App() {
  return (
    <NotificationProvider>
    <MqttProvider>
      <Header />
      <main>
        <Outlet />
      </main>
    </MqttProvider>
    </NotificationProvider>

  )
}
