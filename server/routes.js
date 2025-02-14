const express = require('express');
const router = express.Router();
const BookModel = require('./Models/BookModel');
const UserModel = require('./Models/UserModel');
const jsonwebtoken = require('jsonwebtoken');

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ "message": "App health is fyn" });
});

// Add a new book
router.post('/book', async (req, res) => {
    const { name, photo, reviews } = req.body;

    // console.log(`Received request to add new book: ${name}`);

    try {
        const existingBook = await BookModel.findOne({ name });
        if (existingBook) {
            return res.status(400).json({ message: 'Book name must be unique' });
        }

        const new_book = new BookModel({
            name,
            photo: photo || { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7EmM62Xh0j1QcAXxCYtwi4S6EOHbdFgS3hQ&s" },
            reviews: reviews || []
        });

        if (new_book.reviews.length > 0) {
            const sum = new_book.reviews.reduce((acc, review) => acc + review.rating, 0);
            new_book.rating = sum / new_book.reviews.length;
        }

        await new_book.save();

        // console.log(`Book saved with rating: ${new_book.rating}`);
        res.status(201).json(new_book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await BookModel.find();
        res.status(200).json(books);
    } catch (err) {
        // console.log(`ISE in get all books ${err}`);
    }
});

// Get a book by name
router.get('/book/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const books = await BookModel.find({ name: { $regex: name, $options: 'i' } });

        if (!books.length) {
            return res.status(404).json({ message: 'No books found' });
        }

        res.status(200).json(books);
    } catch (err) {
        // console.log(`ISE at get book/name ${err}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get reviews for a book
router.get('/reviews/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const book = await BookModel.findOne({ name: name });
        const reviews = book.reviews;

        // console.log(reviews);
        // console.log(`reviews fetched successfully`);
        res.status(200).json(reviews);
    } catch (err) {
        // console.log(`ISE in get reviews for book ${err}`);
    }
});

// Add a review for a book
router.post('/reviews/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { reviewer_name, reviewer_email, comment, date } = req.body;

        const book = await BookModel.findOne({ name: name });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const existingReview = book.reviews.find(review => review.reviewer_email === reviewer_email);
        if (existingReview) {
            return res.status(200).json({ message: 'Reviewer has already reviewed this book' });
        }

        const new_review = {
            reviewer_name: reviewer_name,
            reviewer_email: reviewer_email,
            comment: comment,
            date: date
        };
        book.reviews.push(new_review);

        const sum = book.reviews.reduce((acc, review) => acc + review.comment[1], 0);
        const total_rating = sum / book.reviews.length;

        book.rating = total_rating;

        await book.save();

        // console.log(`review added successfully ${new_review.reviewer}`);
        // console.log(`rating updated successfully ${total_rating}`);

        const user = await UserModel.findOne({ email: reviewer_email });
        user.reviews.push(new_review);
        await user.save();

        // console.log(`reviewer review saved`);

        res.status(200).json({ message: "successfully reviewed on book" });
    } catch (err) {
        // console.log(`ISE at post reviews`, err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// User login
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });
        if (!user || password != user.password) {
            res.status(400).json({ message: "Incorrect password" });
        }
        // console.log(user);

        const token = jsonwebtoken.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User logged in successfully', token, user: user });
    } catch (err) {
        // console.log(`ISE at user-login ${err}`);
    }
});

// User registration
router.post('/user/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing_user = await UserModel.findOne({ email: email });
        if (existing_user) {
            res.status(400).json({ message: "email already in registered" });
        }

        const existing_name = await UserModel.findOne({ name: name });
        if (existing_name) {
            res.sendStatus(400).json({ "message": "user name already taken" });
        }

        const new_user = await UserModel.create({
            role: 'reviewer',
            photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBTym3IWgvwc58Oq_BCusGZKtqqllkljgw3g&s",
            name: name,
            email: email,
            password: password
        });

        await new_user.save();

        const token = jsonwebtoken.sign({ id: new_user._id, email: new_user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token, user: new_user });
    } catch (err) {
        // console.log(`ISE at register-user ${err}`);
    }
});

module.exports = router;