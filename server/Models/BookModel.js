const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: mongoose.Schema.Types.Mixed, 
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7EmM62Xh0j1QcAXxCYtwi4S6EOHbdFgS3hQ&s"
    },
    reviews: {
        type: Array,
        default: []
    },
    rating: {
        type: Number,
        default: 0
    }
    
});

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;