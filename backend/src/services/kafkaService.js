const { Kafka } = require('kafkajs');
const SensorData = require('../models/SensorData');
const Machine = require('../models/Machine');
const { sendAlertEmail } = require('./notificationService');

const kafka = new Kafka({
  clientId: 'predictix-backend',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'sensor-group' });

const initKafka = async (io) => {
  try {
    await consumer.connect();
    console.log('Kafka Connected');
    await consumer.subscribe({ topic: 'sensor-data', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        console.log('Received sensor data:', payload);

        // Save to MongoDB (only if connected)
        try {
          await SensorData.create({
            machineId: payload.machineId,
            temperature: payload.temperature,
            vibration: payload.vibration,
            rpm: payload.rpm,
            pressure: payload.pressure,
            timestamp: payload.timestamp || new Date(),
          });
        } catch (e) {}

        // Emit to WebSockets for real-time dashboard
        io.emit(`machine-data-${payload.machineId}`, payload);

        // Check thresholds and trigger alerts
        checkThresholds(payload, io);
      },
    });
  } catch (error) {
    console.warn(`⚠️ Kafka Connection Failed: ${error.message}`);
    console.warn('Running in Demo Mode without Kafka event streaming.');
  }
};

const checkThresholds = async (data, io) => {
  const machine = await Machine.findById(data.machineId);
  if (!machine) return;

  const { thresholds } = machine;
  let status = 'Healthy';
  let alerts = [];

  if (data.temperature > thresholds.temperature) {
    status = 'Warning';
    alerts.push('High Temperature');
  }
  if (data.vibration > thresholds.vibration) {
    status = 'Warning';
    alerts.push('High Vibration');
  }

  // Upgrade to Critical if multiple or extreme
  if (alerts.length > 1) status = 'Critical';

  if (status !== machine.status) {
    machine.status = status;
    await machine.save();
    io.emit('machine-status-update', { machineId: machine._id, status });
    
    if (status !== 'Healthy') {
      const alertData = {
        machineId: machine._id,
        machineName: machine.name,
        severity: status,
        message: alerts.join(', '),
        timestamp: new Date(),
      };
      
      io.emit('new-alert', alertData);

      // Real-time Email Notification
      const technicianEmail = process.env.EMAIL_USER; 
      sendAlertEmail(technicianEmail, {
        ...alertData,
        message: `${alertData.message}. SUGGESTION: ${data.recommendation || 'Check system status.'}`
      });
    }
  }
};

module.exports = { initKafka, checkThresholds };
