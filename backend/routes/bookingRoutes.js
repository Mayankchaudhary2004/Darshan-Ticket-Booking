const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, getBooking, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.post('/', protect, authorize('USER'), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, authorize('ADMIN', 'ORGANIZER'), getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
