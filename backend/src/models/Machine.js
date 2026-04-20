const mongoose = require('mongoose');

const machineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Healthy', 'Warning', 'Critical', 'Maintenance'],
      default: 'Healthy',
    },
    thresholds: {
      temperature: { type: Number, default: 80 },
      vibration: { type: Number, default: 5 },
      rpm: { type: Number, default: 3000 },
      pressure: { type: Number, default: 100 },
    },
    lastMaintenance: {
      type: Date,
    },
    nextMaintenance: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Machine = mongoose.model('Machine', machineSchema);

module.exports = Machine;
