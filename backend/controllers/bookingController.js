const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (USER)
const createBooking = async (req, res, next) => {
  try {
    const { slotId, numberOfTickets, attendees, specialRequests } = req.body;

    if (!slotId || !numberOfTickets) {
      return res.status(400).json({ success: false, message: 'Slot ID and number of tickets are required' });
    }

    const slot = await DarshanSlot.findById(slotId);
    if (!slot || !slot.isActive) {
      return res.status(404).json({ success: false, message: 'Darshan slot not found or inactive' });
    }

    const availableSeats = slot.capacity - slot.bookedCount;
    if (numberOfTickets > availableSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seats available for this slot`
      });
    }

    const totalAmount = slot.pricePerTicket * numberOfTickets;

    const booking = await Booking.create({
      user: req.user._id,
      temple: slot.temple,
      slot: slotId,
      numberOfTickets,
      totalAmount,
      attendees: attendees || [],
      specialRequests
    });

    // Update slot booked count
    await DarshanSlot.findByIdAndUpdate(slotId, { $inc: { bookedCount: numberOfTickets } });
    // Update temple total bookings
    await Temple.findByIdAndUpdate(slot.temple, { $inc: { totalBookings: numberOfTickets } });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('temple', 'name location images')
      .populate('slot', 'date startTime endTime poojaType pricePerTicket');

    res.status(201).json({ success: true, message: 'Booking confirmed!', booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @access  Private (USER)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('temple', 'name location images')
      .populate('slot', 'date startTime endTime poojaType pricePerTicket')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private (ADMIN)
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('temple', 'name location')
      .populate('slot', 'date startTime endTime poojaType')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, count: bookings.length, total, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('temple', 'name location images')
      .populate('slot', 'date startTime endTime poojaType pricePerTicket');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // User can only view own bookings
    if (req.user.role === 'USER' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (USER / ADMIN)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (req.user.role === 'USER' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    // Release seats back
    await DarshanSlot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -booking.numberOfTickets } });

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, getBooking, cancelBooking };
