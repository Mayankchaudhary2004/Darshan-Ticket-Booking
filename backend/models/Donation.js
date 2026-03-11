const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Minimum donation is ₹1']
  },
  purpose: {
    type: String,
    enum: ['General', 'Temple Maintenance', 'Festivals', 'Charity', 'Food Prasadam', 'Education'],
    default: 'General'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  transactionId: {
    type: String,
    unique: true
  }
}, { timestamps: true });

donationSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = 'DON' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
