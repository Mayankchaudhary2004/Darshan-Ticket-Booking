const User = require('../models/User');
const Temple = require('../models/Temple');
const Booking = require('../models/Booking');
const Donation = require('../models/Donation');
const DarshanSlot = require('../models/DarshanSlot');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (ADMIN)
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTemples, totalBookings, totalDonationResult, recentBookings, recentUsers] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      Temple.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Booking.find()
        .populate('user', 'name email')
        .populate('temple', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const totalDonations = totalDonationResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTemples,
        totalBookings,
        totalDonations,
      },
      recentBookings,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, count: users.length, total, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private (ADMIN)
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User updated', user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllUsers, updateUser };
