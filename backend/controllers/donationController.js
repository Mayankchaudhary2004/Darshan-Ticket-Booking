const Donation = require('../models/Donation');
const Temple = require('../models/Temple');

// @desc    Make a donation
// @route   POST /api/donations
// @access  Private (USER)
const createDonation = async (req, res, next) => {
  try {
    const { templeId, amount, purpose, message, isAnonymous } = req.body;

    if (!templeId || !amount) {
      return res.status(400).json({ success: false, message: 'Temple ID and amount are required' });
    }

    const temple = await Temple.findById(templeId);
    if (!temple || !temple.isActive) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }

    const donation = await Donation.create({
      user: req.user._id,
      temple: templeId,
      amount,
      purpose,
      message,
      isAnonymous: isAnonymous || false
    });

    const populatedDonation = await Donation.findById(donation._id)
      .populate('temple', 'name location');

    res.status(201).json({ success: true, message: 'Thank you for your generous donation! 🙏', donation: populatedDonation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my donations
// @route   GET /api/donations/my
// @access  Private (USER)
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate('temple', 'name location images')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (admin)
// @route   GET /api/donations
// @access  Private (ADMIN)
const getAllDonations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Donation.countDocuments();

    const donations = await Donation.find()
      .populate('user', 'name email')
      .populate('temple', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, count: donations.length, total, donations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get temple donations (organizer)
// @route   GET /api/donations/temple/:templeId
// @access  Private (ADMIN / ORGANIZER)
const getTempleDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ temple: req.params.templeId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    res.json({ success: true, count: donations.length, totalAmount, donations });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDonation, getMyDonations, getAllDonations, getTempleDonations };
