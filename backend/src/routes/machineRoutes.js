const express = require('express');
const {
  getMachines,
  getMachineById,
  addMachine,
  updateMachine,
  getMachineData,
} = require('../controllers/machineController');
const { protect, authorize } = require('../utils/authMiddleware');

const router = express.Router();

router.get('/', protect, getMachines);
router.get('/:id', protect, getMachineById);
router.post('/', protect, authorize('Admin'), addMachine);
router.put('/:id', protect, authorize('Admin', 'Engineer'), updateMachine);
router.get('/:id/data', protect, getMachineData);

module.exports = router;
