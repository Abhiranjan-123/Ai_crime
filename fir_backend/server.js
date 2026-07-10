// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes Hooks
app.use('/api/auth', require('./routes/auth'));
app.use('/api/fir', require('./routes/fir'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend cluster running on port ${PORT}`));