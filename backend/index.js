const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const response = require('./utils/response');

dotenv.config();

const app = express();

// Security & Optimization Middleware
app.use(helmet()); // Basic security headers
app.use(morgan('dev')); // Clean request logging
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body limit to prevent DOS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this node. Infrastructure cooling down.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/support', require('./routes/support'));

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER_EXCEPTION:', err.stack);
  return response.error(res, 'Internal synchronisation failure. Security node triggered.', 500);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
