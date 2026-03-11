const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  temple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temple',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DarshanSlot',
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: [true, 'Number of tickets is required'],
    min: [1, 'At least 1 ticket required'],
    max: [10, 'Cannot book more than 10 tickets at once']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED', 'PENDING'],
    default: 'CONFIRMED'
  },
  bookingReference: {
    type: String,
    unique: true
  },
  attendees: [{
    name: { type: String, required: true },
    age: { type: Number }
  }],
  specialRequests: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

// Generate booking reference before save
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'DE' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
