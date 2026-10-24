
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load data
const reviews_data = JSON.parse(
  fs.readFileSync('reviews.json', 'utf8')
);
const dealerships_data = JSON.parse(
  fs.readFileSync('dealerships.json', 'utf8')
);

// Database connection
mongoose.connect('mongodb://mongo_db:27017/', {
  dbName: 'dealershipsDB'
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Insert initial data into MongoDB
async function initializeDatabase() {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

mongoose.connection.once('open', initializeDatabase);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Fetch reviews for a particular dealership
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({
      dealership: Number(req.params.id)
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({
      state: req.params.state
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching dealerships by state'
    });
  }
});

// Fetch a dealership by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const document = await Dealerships.findOne({
      id: Number(req.params.id)
    });

    if (!document) {
      return res.status(404).json({
        error: 'Dealership not found'
      });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching dealership'
    });
  }
});

// Insert a review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        error: 'Invalid review data'
      });
    }

    const latestReview = await Reviews.findOne().sort({ id: -1 });
    const newId = latestReview ? latestReview.id + 1 : 1;

    const review = new Reviews({
      id: newId,
      name: data.name,
      dealership: Number(data.dealership),
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: Number(data.car_year)
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({
      error: 'Error inserting review'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
