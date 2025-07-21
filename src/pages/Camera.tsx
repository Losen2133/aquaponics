import { useMqtt } from "@/contexts/MQTTContext";
import TitleSetter from "@/components/utilities/titlesetter";
import CameraPanel from "@/components/CameraPanel";

export default function MultiCamPanel() {
  const { discoveredCameras } = useMqtt();

  return (
    <div className="container mx-auto p-4">
      <TitleSetter title="Multi-Camera Panel" />
      <h1 className="text-2xl font-bold mb-4">Multi-Camera Panel</h1>
      <p className="mb-4">Cameras will appear here automatically when they come online.</p>

      {discoveredCameras.length === 0 ? (
        <p className="italic text-gray-400">Waiting for cameras to publish IPs via MQTT...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {discoveredCameras.map((cam) => (
            <CameraPanel key={cam.id} cameraId={cam.id} ip={cam.ip} />
          ))}
        </div>
      )}
    </div>
  );
}
