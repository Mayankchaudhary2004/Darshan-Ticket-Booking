const express = require('express');
const router = express.Router();
const { getSlotsByTemple, getAllSlots, getSlot, createSlot, updateSlot, deleteSlot } = require('../controllers/slotController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/temple/:templeId', getSlotsByTemple);
router.get('/', protect, authorize('ADMIN', 'ORGANIZER'), getAllSlots);
router.get('/:id', getSlot);
router.post('/', protect, authorize('ADMIN', 'ORGANIZER'), createSlot);
router.put('/:id', protect, authorize('ADMIN', 'ORGANIZER'), updateSlot);
router.delete('/:id', protect, authorize('ADMIN'), deleteSlot);

module.exports = router;
