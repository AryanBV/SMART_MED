const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// Import routes
const familyRoutes = require('./routes/familyRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    if (req.is('multipart/form-data')) {
      console.log('Request contains file upload');
    } else {
      console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await db.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Base route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});

// API Routes
app.use('/api/family', familyRoutes);
app.use('/api/documents', documentRoutes);

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File Size Limit Exceeded',
      details: 'File size should not exceed 5MB'
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Invalid File Upload',
      details: 'Unexpected field in file upload'
    });
  }
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  console.error('Stack trace:', err.stack);

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.message
    });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate Entry',
      details: 'This record already exists'
    });
  }

  // File upload errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid File Type',
      details: err.message
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Clean up uploaded files on server shutdown
const cleanupUploadedFiles = () => {
  console.log('Cleaning up uploaded files...');
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    for (const file of files) {
      fs.unlinkSync(path.join(uploadDir, file));
    }
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Cleaning up...');
  cleanupUploadedFiles();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Cleaning up...');
  cleanupUploadedFiles();
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for origin: http://localhost:3000`);
  console.log(`File uploads directory: ${uploadDir}`);
});