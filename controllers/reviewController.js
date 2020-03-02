import Review from "../models/reviewModel.js";
import catchAsync from "./../utils/CatchAsync.js";

export const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

export const createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).jsonp({
        status: 'success',
        data: {
            review: newReview
        }
    });
});