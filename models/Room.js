const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    capacity: { type: Number, default: 3 },
    amenities: { type: [String], required: true },
    pricePerHour: { type: Number, required: true }
});

module.exports = mongoose.model('Room', roomSchema);
