import TitleSetter from "@/components/utilities/titlesetter"
import SensorOfflineLog from "@/components/SensorOfflineLog"
import { useMqtt } from "@/contexts/MQTTContext"

const Maintenance = () => {
  const { offlineEvents, sensorNames, onlineStatus } = useMqtt();

  return (
    <div className="min-h-screen font-sans antialiased bg-gray-50">
      <TitleSetter title="Maintenance" />
      <main className="container mx-auto p-5">
        <SensorOfflineLog
          sensors={sensorNames}
          offlineEvents={offlineEvents}
          onlineStatus={onlineStatus}
        />
      </main>
    </div>
  );
}

export default Maintenance