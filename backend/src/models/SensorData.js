const mongoose = require('mongoose');

const sensorDataSchema = mongoose.Schema(
  {
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      required: true,
      index: true,
    },
    temperature: Number,
    vibration: Number,
    rpm: Number,
    pressure: Number,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // MongoDB time-series collection optimization (if supported by the driver/version)
    // timeseries: {
    //   timeField: 'timestamp',
    //   metaField: 'machineId',
    //   granularity: 'seconds'
    // }
  }
);

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Optional: Explicitly create time-series collection if on MongoDB 5.0+
// This is critical for real-world IoT environments
mongoose.connection.on('open', async () => {
  try {
    const collections = await mongoose.connection.db.listCollections({ name: 'sensordatas' }).toArray();
    if (collections.length === 0) {
      await mongoose.connection.db.createCollection('sensordatas', {
        timeseries: {
          timeField: 'timestamp',
          metaField: 'machineId',
          granularity: 'seconds'
        }
      });
      console.log('Time-Series collection created for SensorData');
    }
  } catch (err) {
    // Graceful fallback for older MongoDB versions
  }
});

module.exports = SensorData;
