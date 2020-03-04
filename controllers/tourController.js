import APIFeatures from "../utils/APIFeatures.js";
import Tour from "../models/tourModel.js";
import catchAsync from "./../utils/CatchAsync.js";
import AppError from "../utils/AppError.js";

import * as factory from './handlerFactory.js';

export const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

    next();
};

export const getAllTours = catchAsync(async (req, res) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();

    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

export const getTour = catchAsync(async  (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        results: 1,
        data: {
            'tours': tour
        }
    });
});

export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);

export const getTourStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: {
                    $toUpper: "$difficulty"
                },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    });
});

export const getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            /*Works like a where from SQL*/
            $match: {
                startDates: {
                    $gte : new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group : {
                _id: { $month: '$startDates' },
                numToursStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            /*Add a field*/
            $addField: { month: '$_id' }
        },
        {
            /*Show or Hide a field*/
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numToursStarts: -1 }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    });
});