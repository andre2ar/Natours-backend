import User from "../models/userModel.js";
import catchAsync from './../utils/CatchAsync.js';
import AppError from "../utils/AppError.js";

import * as factory from './handlerFactory.js';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};

export const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

export const updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword',
                400)
        );
    }

    const filteredBody = filterObj(req.body,  'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

// Do not update password
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);