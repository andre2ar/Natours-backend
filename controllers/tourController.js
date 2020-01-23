const fs = require('fs');
const Tour = require("./../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

    next();
};

exports.getAllTours = async (req, res) => {
    try {
        // 1A) FILTERING
        const queryObj = {...req.query};
        const excludedfields = ['page', 'sort', 'limit', 'fields'];
        excludedfields.forEach(el => delete queryObj[el]);

        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // 2) SORTING
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        //FIELD LIMITING
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 4) PAGINATION
        const page = Math.abs(req.query.page * 1) || 1;
        const limit = req.query.limit * 1 || 100;

        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page) {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) {
                throw new Error('This page do not exists');
            }
        }

        const  tours = await query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async  (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            results: 1,
            data: {
                'tours': tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const  tour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data:{
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            data:{
                data: null
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

