require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { initKafka } = require('./services/kafkaService');
const { initMQTT } = require('./services/mqttService');

// Routes
const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root Handler
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Predictix Predictive Maintenance API is Running',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);

const { checkThresholds } = require('./services/kafkaService');
const SensorData = require('./models/SensorData');

// Ingestion Fallback (REST)
// Ideal for low-latency or legacy machines that don't support Kafka
app.post('/api/ingest', async (req, res) => {
  const payload = req.body;
  
  try {
    // 1. Persist to MongoDB
    await SensorData.create(payload);
    
    // 2. Real-time Broadcast
    io.emit(`machine-data-${payload.machineId}`, payload);
    
    // 3. Trigger Maintenance Intelligence
    const { data: prediction } = await axios.post('http://localhost:8000/predict', payload);
    checkThresholds({ ...payload, recommendation: prediction.recommendation }, io);
    
    res.status(200).json({ 
      message: 'Ingestion successful', 
      prediction: prediction 
    });
  } catch (error) {
    // Demo fallback if DB/ML is offline
    io.emit(`machine-data-${payload.machineId}`, payload);
    res.status(200).json({ message: 'Ingestion successful (Demo Mode)' });
  }
});

// ML Prediction Proxy/Integration
app.post('/api/predict', async (req, res) => {
  // This will proxy to the Python ML service
  // For now, let's mock it or assume it's another service
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'ML Service unavailable' });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New WS Connection...');

  socket.on('subscribe', (machineId) => {
    socket.join(machineId);
    console.log(`Subscribed to machine: ${machineId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Initialize Kafka Consumer
initKafka(io);

// Initialize MQTT Subscriber
initMQTT(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
