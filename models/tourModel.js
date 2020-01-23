const mongoose = require('mongoose');

const requiredDataMessage = 'A tour must have a ';
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, requiredDataMessage+'name'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, requiredDataMessage+'duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, requiredDataMessage+'group size']
    },
    difficulty: {
        type: String,
        required: [true, requiredDataMessage+'difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, requiredDataMessage+'price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, requiredDataMessage+'summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, requiredDataMessage+'cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;