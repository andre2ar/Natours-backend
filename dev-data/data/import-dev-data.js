import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from "path";

import Tour from "../../models/tourModel.js";
import User from "../../models/userModel.js";
import Review from "../../models/reviewModel.js";

dotenv.config({path: './config.env'});
const __dirname = path.resolve();
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then( () => {
    console.log("DB connected...");
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf-8'));

//IMPORT
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Tours successfully loaded!');

        await User.create(users, { validateBeforeSave: false });
        console.log('Users successfully loaded!');

        await Review.create(reviews);
        console.log('Reviews successfully loaded!');

        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }

    process.exit();
};

//Delete
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Tours succefully deleted!');

        await Review.deleteMany();
        console.log('Reviews succefully deleted!');

        await User.deleteMany();
        console.log('Users succefully deleted!');

        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }

    process.exit();
};

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}