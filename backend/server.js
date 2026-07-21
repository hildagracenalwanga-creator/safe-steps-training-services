// Environment Configuration
require('dotenv').config();

const express = require('express');
const path = require('path');

// Import modular API route handlers with exact filenames
const contactRoutes = require('./routes/contact');
const resourceRoutes = require('./routes/resources');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/orders', orderRoutes);

// Fallback route returning index.html for unknown SPA requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});