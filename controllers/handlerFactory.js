import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/AppError.js";
import APIFeatures from "../utils/APIFeatures.js";

export const createOne = Model => catchAsync(async (req, res) => {
    const  doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

export const getOne = (Model, popOption) => catchAsync(async  (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOption) query = query.populate(popOption);

    const doc = await query;

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        results: 1,
        data: {
            data: doc
        }
    });
});

export const getAll = Model => catchAsync(async (req, res) => {
    // To allow for nested GET reviews on tour (Workaround)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();

    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    });
});

export const updateOne = Model => catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: "success",
        data:{
            data: doc
        }
    });
});

export const deleteOne = Model => catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: "success",
        data: null
    });
});
