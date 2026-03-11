const express = require('express');
const router = express.Router();
const { getTemples, getTemple, createTemple, updateTemple, deleteTemple } = require('../controllers/templeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/', getTemples);
router.get('/:id', getTemple);
router.post('/', protect, authorize('ADMIN', 'ORGANIZER'), createTemple);
router.put('/:id', protect, authorize('ADMIN', 'ORGANIZER'), updateTemple);
router.delete('/:id', protect, authorize('ADMIN'), deleteTemple);

module.exports = router;
