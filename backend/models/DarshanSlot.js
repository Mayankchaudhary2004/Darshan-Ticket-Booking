const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema({
  temple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temple',
    required: [true, 'Temple is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  poojaType: {
    type: String,
    enum: ['General Darshan', 'Special Darshan', 'VIP Darshan', 'Abhishek', 'Aarti', 'Prasadam'],
    default: 'General Darshan'
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  bookedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  pricePerTicket: {
    type: Number,
    required: [true, 'Price per ticket is required'],
    min: [0, 'Price cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Virtual: available seats
darshanSlotSchema.virtual('availableSeats').get(function () {
  return this.capacity - this.bookedCount;
});

darshanSlotSchema.set('toJSON', { virtuals: true });
darshanSlotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);
