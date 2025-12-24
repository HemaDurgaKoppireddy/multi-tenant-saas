const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { getTenantDetails } = require('../controllers/tenants');

// Protected
router.get('/:tenantId', authMiddleware, getTenantDetails);

module.exports = router;
