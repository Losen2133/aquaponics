import React from "react";
import * as XLSX from "xlsx";

interface OfflineEvent {
  sensor: string;
  wentOfflineAt: Date;
  cameOnlineAt?: Date;
}

interface SensorOfflineLogProps {
  sensors: string[];
  offlineEvents: OfflineEvent[];
  onlineStatus: Record<string, boolean>;
}

const SensorOfflineLog: React.FC<SensorOfflineLogProps> = ({
  sensors,
  offlineEvents,
  onlineStatus,
}) => {
  const handleDownload = () => {
    const data = offlineEvents.map((e) => ({
      Sensor: e.sensor,
      "Went Offline": e.wentOfflineAt.toLocaleString(),
      "Came Online": e.cameOnlineAt ? e.cameOnlineAt.toLocaleString() : "Still Offline",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offline Log");
    XLSX.writeFile(workbook, "sensor_offline_log.xlsx");
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Download Excel Log
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sensors.map((sensor) => (
          <details key={sensor} className="bg-white rounded shadow p-4">
            <summary className="cursor-pointer text-lg font-bold mb-2">
              {sensor} - {onlineStatus[sensor]
                ? <span className="text-green-600 font-semibold">Online</span>
                : <span className="text-red-600 font-semibold">Offline</span>}
            </summary>
            <div>
              <h4 className="font-semibold mb-1">Offline Events:</h4>
              <ul className="list-disc ml-5">
                {offlineEvents.filter((e) => e.sensor === sensor).length === 0 ? (
                  <li className="text-gray-500">No offline events</li>
                ) : (
                  offlineEvents
                    .filter((e) => e.sensor === sensor)
                    .map((e, idx) => (
                      <li key={idx}>
                        <span className="text-red-600">
                          Offline:
                        </span>{" "}
                        {e.wentOfflineAt.toLocaleString()}
                        {e.cameOnlineAt && (
                          <span className="text-green-600">
                            {" "}| Online: {e.cameOnlineAt.toLocaleString()}
                          </span>
                        )}
                        {!e.cameOnlineAt && (
                          <span className="text-yellow-600"> | Still Offline</span>
                        )}
                      </li>
                    ))
                )}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default SensorOfflineLog;