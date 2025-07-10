import { useEffect } from "react";
import mqtt, { MqttClient } from "mqtt";
import { toast } from "react-toastify";

const MQTTListener = () => {
  useEffect(() => {
    const client: MqttClient = mqtt.connect("ws://localhost:9001"); // Your MQTT WebSocket broker

    client.on("connect", () => {
      console.log("MQTT Connected");
      client.subscribe("sensor/ultrasonic/#", (err) => {
        if (err) {
          console.error("MQTT Subscribe error:", err.message);
        }
      });
    });

    client.on("message", (topic: string, message: Buffer) => {
      try {
        const json = JSON.parse(message.toString());

        const sensor = json.sensor;
        const valueCm = parseFloat(json.value_cm);

        console.log(`[MQTT] ${topic}: ${valueCm} cm`);

        // ✅ Notify if object is within 10 cm
        if (sensor === "Ultrasonic" && valueCm < 10) {
          toast.error(`⚠️ Object too close! Only ${valueCm.toFixed(1)} cm away`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (err) {
        console.error("Failed to parse MQTT message:", err);
      }
    });

    return () => {
      client.end(true);
    };
  }, []);

  return null; // No UI rendered here
};

export default MQTTListener;
