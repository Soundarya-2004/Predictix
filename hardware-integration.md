# 🔌 Hardware Integration Guide: Adding a Sensor to the Circuit

To connect a physical sensor to Predictix, you will need a microcontroller (like ESP32 or Raspberry Pi) to act as a bridge between the physical circuit and the Predictix Cloud.

## 1. The Circuit Setup
### Components Needed:
- **Microcontroller**: ESP32 (Recommended for built-in WiFi).
- **Sensors**: 
  - DHT22 (Temperature/Humidity)
  - MPU6050 (Vibration/Accelerometer)
- **Cabling**: Jumper wires and a breadboard.

### Typical Wiring (ESP32 + DHT22):
1. **VCC** (Sensor) → **3.3V** (ESP32)
2. **GND** (Sensor) → **GND** (ESP32)
3. **Data** (Sensor) → **GPIO 4** (ESP32)

## 2. The Firmware (Code)
Upload a sketch to your ESP32 that reads the sensor and sends it to Predictix via **MQTT** or **REST**.

### Example Arduino/ESP32 Code Snippet (MQTT):
```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_PREDICTIX_IP";
const char* machine_id = "YOUR_MACHINE_ID_FROM_UI";

void loop() {
  float temp = readTemperature(); // Your sensor reading logic
  String payload = "{\"temperature\":" + String(temp) + "}";
  
  String topic = "predictix/sensors/" + String(machine_id);
  client.publish(topic.c_str(), payload.c_str());
  
  delay(5000); // Send data every 5 seconds
}
```

## 3. Registering in Predictix
1. Open the **Machines** page in the Predictix Dashboard.
2. Register the new machine to get its **Unique ID**.
3. Flash that ID into your ESP32 code.
4. Once the ESP32 powers up and connects to WiFi, you will see the data flowing into your dashboard **instantly**.

## 4. AI Feedback Loop
The AI Engine will automatically start analyzing your new sensor data. If the ESP32 sends a high vibration value, the AI will immediately:
1. Update the dashboard card to **Critical**.
2. Send an **Email Alert** to the maintenance team.
3. Add a **Suggestion** (e.g., "Check shaft alignment") to the Alerts history.
