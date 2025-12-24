const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { getTenantDetails ,updateTenant} = require('../controllers/tenants');

// Protected
router.get('/:tenantId', authMiddleware, getTenantDetails);
router.put('/:tenantId', authMiddleware, updateTenant);

module.exports = router;
