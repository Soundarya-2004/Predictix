const mqtt = require('mqtt');
const { checkThresholds } = require('./kafkaService');
const SensorData = require('../models/SensorData');

const initMQTT = (io) => {
  const client = mqtt.connect(process.env.MQTT_BROKER || 'mqtt://localhost:1883');

  client.on('connect', () => {
    console.log('MQTT Connected');
    client.subscribe('predictix/sensors/+', (err) => {
      if (!err) {
        console.log('Subscribed to MQTT sensor topics: predictix/sensors/+');
      }
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      const machineId = topic.split('/').pop();
      
      const data = {
        machineId,
        ...payload,
        timestamp: payload.timestamp || new Date()
      };

      console.log(`MQTT Data [${machineId}]:`, data);

      // 1. Persist to MongoDB
      try {
        await SensorData.create(data);
      } catch (dbErr) {
        // Silently handle if DB is in demo mode/offline
      }

      // 2. Real-time Broadcast
      io.emit(`machine-data-${machineId}`, data);

      // 3. Trigger Analytics
      checkThresholds(data, io);

    } catch (err) {
      console.error('MQTT Message Error:', err.message);
    }
  });

  return client;
};

module.exports = { initMQTT };
