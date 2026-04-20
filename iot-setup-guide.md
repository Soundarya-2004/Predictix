# 📡 Manual Sensor Connection Guide

Follow these steps to connect a real-time sensor and see its readings on the dashboard.

## 1. Register Your Machine
- Go to [http://localhost:5173/machines](http://localhost:5173/machines).
- Click **"Add Machine"**.
- After it appears in the table, click **(Copy)** next to the Machine ID.

## 2. Send Data via REST (Simple Test)
Open your terminal (PowerShell or Bash) and run the following command. **Replace `COPIED_ID` with the ID you just copied.**

```bash
curl -X POST http://localhost:5000/api/ingest \
     -H "Content-Type: application/json" \
     -d '{
       "machineId": "COPIED_ID",
       "temperature": 78.5,
       "vibration": 4.2,
       "rpm": 1500,
       "pressure": 102.5
     }'
```

## 3. Send Data via MQTT (Professional IoT)
If you have an MQTT client (like MQTT.fx or paho-mqtt):
- **Broker**: `localhost`
- **Port**: `1883`
- **Topic**: `predictix/sensors/COPIED_ID`
- **Payload**:
  ```json
  {
    "temperature": 82.0,
    "vibration": 5.5,
    "rpm": 1600,
    "pressure": 105.0
  }
  ```

## 4. Verify in Real-Time
1. Go to the [Dashboard](http://localhost:5173/).
2. Look at the **System Performance** chart. You will see a new data point appear immediately.
3. Look at the **Asset Monitoring** cards. The values will update to match what you just sent.
4. Check the **Alerts** page if you sent values that exceed safety thresholds.
