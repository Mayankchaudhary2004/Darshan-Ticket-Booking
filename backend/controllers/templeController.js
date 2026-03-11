const Temple = require('../models/Temple');

// @desc    Get all active temples
// @route   GET /api/temples
// @access  Public
const getTemples = async (req, res, next) => {
  try {
    const { search, city, state, page = 1, limit = 9 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { deity: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };

    const total = await Temple.countDocuments(query);
    const temples = await Temple.find(query)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: temples.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      temples
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single temple
// @route   GET /api/temples/:id
// @access  Public
const getTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id).populate('organizer', 'name email');
    if (!temple || !temple.isActive) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }
    res.json({ success: true, temple });
  } catch (error) {
    next(error);
  }
};

// @desc    Create temple
// @route   POST /api/temples
// @access  Private (ADMIN / ORGANIZER)
const createTemple = async (req, res, next) => {
  try {
    const templeData = { ...req.body, organizer: req.user._id };
    const temple = await Temple.create(templeData);
    res.status(201).json({ success: true, message: 'Temple created successfully', temple });
  } catch (error) {
    next(error);
  }
};

// @desc    Update temple
// @route   PUT /api/temples/:id
// @access  Private (ADMIN / ORGANIZER)
const updateTemple = async (req, res, next) => {
  try {
    let temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }
    // Organizer can only update their own temple
    if (req.user.role === 'ORGANIZER' && temple.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this temple' });
    }

    temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Temple updated successfully', temple });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (deactivate) temple
// @route   DELETE /api/temples/:id
// @access  Private (ADMIN)
const deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }
    res.json({ success: true, message: 'Temple removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTemples, getTemple, createTemple, updateTemple, deleteTemple };
