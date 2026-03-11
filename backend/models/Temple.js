const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Temple name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    pincode: { type: String, trim: true }
  },
  deity: {
    type: String,
    trim: true,
    default: ''
  },
  images: [{ type: String }],
  timings: {
    openTime: { type: String, default: '06:00' },
    closeTime: { type: String, default: '20:00' }
  },
  facilities: [{ type: String }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);
