const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

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

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});