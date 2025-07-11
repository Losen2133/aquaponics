import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { MqttProvider } from '@/contexts/MQTTContext'

export default function App() {
  return (
    <MqttProvider>
      <Header />
      <main>
        <Outlet />
      </main>
    </MqttProvider>
  )
}
