require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      status: 'healthy', 
      db: 'connected',
      timestamp: new Date().toISOString()
    } 
  });
});

// Basic route test
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'SaaS Backend API v1.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
