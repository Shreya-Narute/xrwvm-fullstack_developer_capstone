
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

// MongoDB connection
// MONGODB_URL can override the default connection URL.
const mongoUrl =
  process.env.MONGODB_URL || 'mongodb://mongo_db:27017/';

// Models
