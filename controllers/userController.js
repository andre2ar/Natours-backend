const User = require('./../models/userModel');
const catchAsync = require('./../utils/CatchAsync');
exports.getAllUsers = catchAsync(async (req, res) => {
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};