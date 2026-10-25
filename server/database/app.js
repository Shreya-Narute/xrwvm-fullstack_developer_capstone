```javascript
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load JSON data from the data folder, if present,
// otherwise load it from the current directory.
function loadJsonFile(filename) {
  const possiblePaths = [
    path.join(__dirname, 'data', filename),
    path.join(__dirname, filename),
  ];

  const filePath = possiblePaths.find((file) =>
    fs.existsSync(file)
  );

  if (!filePath) {
    throw new Error(`Cannot find ${filename} in the data folder or database folder.`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

let reviewsData;
let dealershipsData;

try {
  reviewsData = loadJsonFile('reviews.json');
  dealershipsData = loadJsonFile('dealerships.json');
} catch (error) {
  console.error('Error loading initial data:', error.message);
  process.exit(1);
}

// Models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Database connection
const mongoUrl =
  process.env.MONGODB_URL || 'mongodb://mongo_db:27017/';

mongoose
  .connect(mongoUrl, { dbName: 'dealershipsDB' })
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Insert initial data only when collections are empty.
      if (await Reviews.countDocuments() === 0) {
        await Reviews.insertMany(reviewsData.reviews || []);
      }

      if (await Dealerships.countDocuments() === 0) {
        await Dealerships.insertMany(dealershipsData.dealerships || []);
      }

      console.log('Database initialization completed');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

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
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Fetch reviews for a dealership
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({
      dealership: Number(req.params.id),
    });

    res.json(documents);
  } catch (error) {
    console.error('Error fetching dealership reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching dealerships:', error);
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({
      state: req.params.state,
    });

    res.json(documents);
  } catch (error) {
    console.error('Error fetching dealerships by state:', error);
    res.status(500).json({
      error: 'Error fetching dealerships by state',
    });
  }
});

// Fetch a dealership by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const document = await Dealerships.findOne({
      id: Number(req.params.id),
    });

    if (!document) {
      return res.status(404).json({
        error: 'Dealership not found',
      });
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching dealership:', error);
    res.status(500).json({
      error: 'Error fetching dealership',
    });
  }
});

// Insert a review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({
        error: 'Invalid review data',
      });
    }

    const requiredFields = [
      'name',
      'dealership',
      'review',
      'purchase',
      'purchase_date',
      'car_make',
      'car_model',
      'car_year',
    ];

    for (const field of requiredFields) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ''
      ) {
        return res.status(400).json({
          error: `Missing field: ${field}`,
        });
      }
    }

    const dealershipId = Number(data.dealership);
    const carYear = Number(data.car_year);

    if (!Number.isFinite(dealershipId) || !Number.isFinite(carYear)) {
      return res.status(400).json({
        error: 'Dealership ID and car year must be valid numbers',
      });
    }

    const latestReview = await Reviews.findOne().sort({ id: -1 });
    const newId = latestReview ? latestReview.id + 1 : 1;

    const review = new Reviews({
      id: newId,
      name: data.name,
      dealership: dealershipId,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: carYear,
      sentiment: data.sentiment?.sentiment || data.sentiment || 'neutral',
    });

    const savedReview = await review.save();

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error inserting review:', error);

    return res.status(500).json({
      error: 'Error inserting review',
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```
