const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: './config.env'});
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

if(process.env.NODE_ENV === 'development' || !process.env.PORT)
    port = 3000;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});