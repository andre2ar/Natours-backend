const mongoose = require('mongoose');
const slugify = require('slugify');

const requiredDataMessage = 'A tour must have a ';
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, requiredDataMessage+'name'],
        unique: true,
        trim: true,
        maxlength: [40, requiredDataMessage+'less or equal 40 characteres'],
        minlength: [10, requiredDataMessage+'more or equal 10 characteres']
    },
    slug: String,
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
        required: [true, requiredDataMessage+'difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, requiredDataMessage+'price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // THIS only point to current doc on New document creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
        select: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//Document middleware: runs berfore .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});

    next();
});

// Query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;