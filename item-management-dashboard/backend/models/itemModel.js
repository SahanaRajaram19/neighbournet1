const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'unavailable'],
        default: 'available',
    },
    condition: {
        type: String,
        enum: ['excellent', 'good', 'fair'],
        required: true,
    },
    bookings: {
        type: Number,
        default: 0,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;