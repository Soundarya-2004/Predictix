const Machine = require('../models/Machine');
const SensorData = require('../models/SensorData');

// @desc    Get all machines
// @route   GET /api/machines
// @access  Private
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find({});
    if (machines.length > 0) {
      return res.json(machines);
    }
    // Fallback to Demo Machines if DB is empty
    throw new Error('No machines found');
  } catch (error) {
    const demoMachines = [
      {
        _id: '6623e1a2c3d4e5f6a7b8c9d0',
        name: 'Industrial Pump #4',
        type: 'Centrifugal',
        location: 'Sector 7G',
        status: 'Healthy',
        thresholds: { temperature: 80, vibration: 5, rpm: 3000, pressure: 100 }
      },
      {
        _id: '6623e1a2c3d4e5f6a7b8c9d1',
        name: 'Cooling Motor #2',
        type: 'Induction',
        location: 'Zone B',
        status: 'Warning',
        thresholds: { temperature: 85, vibration: 6, rpm: 1800, pressure: 40 }
      },
      {
        _id: '6623e1a2c3d4e5f6a7b8c9d2',
        name: 'Main Conveyor',
        type: 'Belt Drive',
        location: 'Assembly Line A',
        status: 'Healthy',
        thresholds: { temperature: 60, vibration: 4, rpm: 500, pressure: 0 }
      }
    ];
    res.json(demoMachines);
  }
};

// @desc    Get machine by ID
// @route   GET /api/machines/:id
// @access  Private
const getMachineById = async (req, res) => {
  const machine = await Machine.findById(req.params.id);

  if (machine) {
    res.json(machine);
  } else {
    res.status(404).json({ message: 'Machine not found' });
  }
};

// @desc    Add new machine
// @route   POST /api/machines
// @access  Private/Admin
const addMachine = async (req, res) => {
  const { name, type, location, thresholds } = req.body;

  const machine = new Machine({
    name,
    type,
    location,
    thresholds,
  });

  const createdMachine = await machine.save();
  res.status(201).json(createdMachine);
};

// @desc    Update machine
// @route   PUT /api/machines/:id
// @access  Private/Admin
const updateMachine = async (req, res) => {
  const { name, type, location, status, thresholds, nextMaintenance } = req.body;

  const machine = await Machine.findById(req.params.id);

  if (machine) {
    machine.name = name || machine.name;
    machine.type = type || machine.type;
    machine.location = location || machine.location;
    machine.status = status || machine.status;
    machine.thresholds = thresholds || machine.thresholds;
    machine.nextMaintenance = nextMaintenance || machine.nextMaintenance;

    const updatedMachine = await machine.save();
    res.json(updatedMachine);
  } else {
    res.status(404).json({ message: 'Machine not found' });
  }
};

// @desc    Get sensor data for a machine
// @route   GET /api/machines/:id/data
// @access  Private
const getMachineData = async (req, res) => {
  const data = await SensorData.find({ machineId: req.params.id })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
};

module.exports = {
  getMachines,
  getMachineById,
  addMachine,
  updateMachine,
  getMachineData,
};
