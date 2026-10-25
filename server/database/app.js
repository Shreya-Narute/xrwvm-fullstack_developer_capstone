
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3030;

// Temporary workaround for the Docker networking issue.
// The host gateway was reachable from the API container.
const mongoUrl =
  process.env.MONGODB_URL || 'mongodb://172.18.0.1:27017/';

app.use(cors());
app.use(express.json());

const dealershipSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'dealerships' }
);

let Dealership;

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoUrl, {
      dbName: 'dealershipsDB',
      serverSelectionTimeoutMS: 10000
    });

    console.log('Connected to MongoDB');

    Dealership =
      mongoose.models.Dealership ||
      mongoose.model('Dealership', dealershipSchema);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

app.get('/', (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/fetchDealers', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || !Dealership) {
      return res.status(503).json({
        error: 'MongoDB is not connected'
      });
    }

    const dealers = await Dealership.find({});
    res.json(dealers);
  } catch (error) {
    console.error('Error fetching dealerships:', error.message);
    res.status(500).json({
      error: 'Error fetching dealerships'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB();
});
