const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    bookId: String,
    comment: String,
    date: Date
});

const RatingSchema = new mongoose.Schema({
    bookId: String,
    score: Number,
    date: Date
});

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['admin', 'reviewer'],
        required: true
    },
    photo:{
        type:String,
    }, 
    email:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    reviews: [ReviewSchema],
    ratings: [RatingSchema]
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;