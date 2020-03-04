import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/AppError.js";

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