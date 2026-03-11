const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

// @desc    Get slots for a temple
// @route   GET /api/slots/temple/:templeId
// @access  Public
const getSlotsByTemple = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { temple: req.params.templeId, isActive: true };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else {
      // Default: only future slots
      query.date = { $gte: new Date() };
    }

    const slots = await DarshanSlot.find(query)
      .populate('temple', 'name location')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: slots.length, slots });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all slots (admin)
// @route   GET /api/slots
// @access  Private (ADMIN)
const getAllSlots = async (req, res, next) => {
  try {
    const slots = await DarshanSlot.find()
      .populate('temple', 'name location')
      .sort({ date: -1 });
    res.json({ success: true, count: slots.length, slots });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single slot
// @route   GET /api/slots/:id
// @access  Public
const getSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id).populate('temple', 'name location images');
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Create darshan slot
// @route   POST /api/slots
// @access  Private (ADMIN / ORGANIZER)
const createSlot = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.body.temple);
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

    const slot = await DarshanSlot.create(req.body);
    res.status(201).json({ success: true, message: 'Darshan slot created', slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Update darshan slot
// @route   PUT /api/slots/:id
// @access  Private (ADMIN / ORGANIZER)
const updateSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot updated', slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete darshan slot
// @route   DELETE /api/slots/:id
// @access  Private (ADMIN)
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSlotsByTemple, getAllSlots, getSlot, createSlot, updateSlot, deleteSlot };
