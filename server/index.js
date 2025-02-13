const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const user_profile = path.join(__dirname, 'default_user_profile.jpg');
const book_profile = path.join(__dirname, `default_book.jpg`);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
}).then(() => {
    // console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const routes = require('./routes');
app.use('/', routes);

app.listen(PORT, () => {
    // console.log(`app listening to ${PORT}`);
});
