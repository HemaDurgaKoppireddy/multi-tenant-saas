const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const {
  listTenants,
  getTenantDetails,
  updateTenant
} = require('../controllers/tenants');

// 🔐 SUPER ADMIN ONLY
router.get(
  '/',
  authMiddleware,
  requireRole('super_admin'),
  listTenants
);

// 🔐 SUPER ADMIN ONLY
router.get(
  '/:tenantId',
  authMiddleware,
  getTenantDetails
);


// 🔐 SUPER ADMIN ONLY
router.put(
  '/:tenantId',
  authMiddleware,
  updateTenant
);


module.exports = router;
