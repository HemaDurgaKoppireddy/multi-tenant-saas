const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json()); // Only need this once
app.use('/api/tenants', tenantRoutes);

// 2. Routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/api/auth', authRoutes);

// 3. Error Handling Middleware (MUST be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

// 4. Export and/or Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

module.exports = app;