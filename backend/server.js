const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); 
const path = require('path');
dotenv.config();



const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const verifyRoutes = require('./routes/verifyRoutes');

const app = express();
app.use(express.json());
// Allow multiple origins
app.use(express.static(path.join(__dirname, '../frontend'))); 

app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
mongoose
  .connect('mongodb://localhost:27017/secure_file_sharing_system', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', authenticate, fileRoutes);
app.use('/api/files', verifyRoutes);

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
