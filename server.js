import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path: './config.env'});

import app from './app.js';

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

let port = process.env.PORT;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});