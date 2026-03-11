const express = require('express');
const router = express.Router();
const { createDonation, getMyDonations, getAllDonations, getTempleDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.post('/', protect, createDonation);
router.get('/my', protect, getMyDonations);
router.get('/', protect, authorize('ADMIN'), getAllDonations);
router.get('/temple/:templeId', protect, authorize('ADMIN', 'ORGANIZER'), getTempleDonations);

module.exports = router;
