const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const familyRoutes = require('./routes/familyRoutes');
const medicalRoutes = require('./routes/medicalRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
async function testConnection() {
    try {
        await db.query('SELECT 1');
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

testConnection();

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/documents', documentRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Diabetes Management System API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});