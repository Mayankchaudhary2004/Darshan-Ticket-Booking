const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Temple = require('./models/Temple');
const DarshanSlot = require('./models/DarshanSlot');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB. Starting seed...');

    // Clear existing data
    await User.deleteMany({});
    await Temple.deleteMany({});
    await DarshanSlot.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create Admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@darshanease.in',
      password: 'admin123',
      phone: '9999999999',
      role: 'ADMIN'
    });
    console.log('✅ Admin created:', admin.email);

    // Create sample user
    const sampleUser = await User.create({
      name: 'Ramesh Kumar',
      email: 'user@darshanease.in',
      password: 'user123',
      phone: '9876543210',
      role: 'USER'
    });
    console.log('✅ Sample user created:', sampleUser.email);

    // Create Temples
    const temples = await Temple.insertMany([
      {
        name: 'Tirupati Balaji Temple',
        description: 'Sri Venkateswara Swamy Temple, also known as Tirupati Balaji Temple, is one of the most visited and richest religious sites in the world. Located in Tirumala Hills in Andhra Pradesh, it is dedicated to Lord Venkateswara, an incarnation of Lord Vishnu.',
        location: { city: 'Tirupati', state: 'Andhra Pradesh', address: 'Tirumala, Tirupati', pincode: '517501' },
        deity: 'Lord Venkateswara',
        timings: { openTime: '04:00', closeTime: '23:00' },
        facilities: ['Parking', 'Prasadam', 'Calendar Darshan', 'Special Entry', 'Accommodation', 'Medical Aid'],
        organizer: admin._id,
        rating: 4.9,
        isActive: true
      },
      {
        name: 'Vaishno Devi Temple',
        description: 'Vaishno Devi Temple is a famous Hindu temple dedicated to Goddess Vaishno Devi, nestled in the Trikuta Mountains. It is one of the holiest shrines in India situated at an altitude of 5,200 feet.',
        location: { city: 'Katra', state: 'Jammu & Kashmir', address: 'Trikuta Mountains, Katra', pincode: '182301' },
        deity: 'Mata Vaishno Devi',
        timings: { openTime: '06:00', closeTime: '22:00' },
        facilities: ['Trekking Routes', 'Helicopter Service', 'Prasadam', 'Accommodation', 'Medical Posts'],
        organizer: admin._id,
        rating: 4.8,
        isActive: true
      },
      {
        name: 'Kashi Vishwanath Temple',
        description: 'The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. The temple complex was renovated and the Kashi Vishwanath Corridor was built in 2022.',
        location: { city: 'Varanasi', state: 'Uttar Pradesh', address: 'Vishwanath Gali, Varanasi', pincode: '221001' },
        deity: 'Lord Shiva',
        timings: { openTime: '03:00', closeTime: '23:00' },
        facilities: ['Mangala Aarti', 'Prasadam', 'Security', 'Lockers', 'Photography Zone'],
        organizer: admin._id,
        rating: 4.7,
        isActive: true
      },
      {
        name: 'Shirdi Sai Baba Temple',
        description: 'The Shirdi Sai Baba Temple in Shirdi, Maharashtra is one of the most visited temples in India. Sai Baba of Shirdi was an Indian spiritual master who is regarded as saintly by his Hindu and Muslim devotees.',
        location: { city: 'Shirdi', state: 'Maharashtra', address: 'Sai Baba Mandir, Shirdi', pincode: '423109' },
        deity: 'Sai Baba',
        timings: { openTime: '04:00', closeTime: '23:00' },
        facilities: ['Online Darshan', 'Prasadam', 'Accommodation', 'Medical', 'Guided Tours'],
        organizer: admin._id,
        rating: 4.8,
        isActive: true
      },
      {
        name: 'Siddhivinayak Temple',
        description: 'Shree Siddhivinayak Ganapati Mandir is a Hindu temple located in Prabhadevi, Mumbai. It is dedicated to Lord Ganesha (Siddhivinayak). The temple was originally built in 1801 and is one of the richest temples in the world.',
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'Prabhadevi, Mumbai', pincode: '400028' },
        deity: 'Lord Ganesha',
        timings: { openTime: '05:30', closeTime: '22:00' },
        facilities: ['Live Darshan', 'Prasadam Box', 'VIP Queue', 'Parking', 'Wheelchair Access'],
        organizer: admin._id,
        rating: 4.6,
        isActive: true
      },
      {
        name: 'Meenakshi Amman Temple',
        description: 'The Meenakshi Amman Temple is a historic Hindu temple in Madurai, Tamil Nadu. The temple is dedicated to Goddess Meenakshi, a form of Parvati, and her consort Lord Sundareswarar (Shiva). The temple houses 14 gateway towers.',
        location: { city: 'Madurai', state: 'Tamil Nadu', address: 'Madurai City Center, Madurai', pincode: '625001' },
        deity: 'Goddess Meenakshi',
        timings: { openTime: '05:00', closeTime: '21:30' },
        facilities: ['Audio Guide', 'Museum', 'Prasadam', 'Photography (outside)', 'Heritage Walk'],
        organizer: admin._id,
        rating: 4.7,
        isActive: true
      }
    ]);

    console.log(`✅ ${temples.length} temples created`);

    // Create Darshan Slots for each temple
    const slotData = [];
    const types = ['General Darshan', 'Special Darshan', 'VIP Darshan', 'Aarti'];
    const prices = { 'General Darshan': 50, 'Special Darshan': 300, 'VIP Darshan': 1000, 'Aarti': 200 };
    const times = [
      { start: '06:00', end: '08:00' },
      { start: '09:00', end: '11:00' },
      { start: '14:00', end: '16:00' },
      { start: '18:00', end: '20:00' }
    ];

    for (const temple of temples) {
      for (let dayOffset = 0; dayOffset <= 14; dayOffset++) {
        const slotDate = new Date();
        slotDate.setDate(slotDate.getDate() + dayOffset);
        slotDate.setHours(0, 0, 0, 0);

        for (const t of times) {
          const poojaType = dayOffset % 4 === 0 ? 'VIP Darshan' : dayOffset % 3 === 0 ? 'Special Darshan' : dayOffset % 2 === 0 ? 'Aarti' : 'General Darshan';
          slotData.push({
            temple: temple._id,
            date: slotDate,
            startTime: t.start,
            endTime: t.end,
            poojaType,
            capacity: poojaType === 'General Darshan' ? 200 : poojaType === 'Special Darshan' ? 50 : poojaType === 'VIP Darshan' ? 20 : 100,
            pricePerTicket: prices[poojaType],
            isActive: true
          });
        }
      }
    }

    await DarshanSlot.insertMany(slotData);
    console.log(`✅ ${slotData.length} darshan slots created (next 15 days)`);

    console.log('\n🎉 Seed complete! Login credentials:');
    console.log('  Admin: admin@darshanease.in / admin123');
    console.log('  User:  user@darshanease.in  / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
