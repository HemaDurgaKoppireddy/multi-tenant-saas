const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../utils/db');

module.exports = {
  // API 1: POST /api/auth/register-tenant (PUBLIC)
  registerTenant: async (req, res) => {
    const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;
    
    try {
      // Transaction: create tenant + admin user
      const [tenant] = await knex('tenants')
        .insert({
          name: tenantName,
          subdomain,
          subscription_plan: 'free',
          max_users: 5,
          max_projects: 3
        })
        .returning(['id', 'subdomain']);

      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const [adminUser] = await knex('users')
        .insert({
          tenant_id: tenant.id,
          email: adminEmail,
          password_hash: hashedPassword,
          full_name: adminFullName,
          role: 'tenant_admin'
        })
        .returning(['id', 'email', 'full_name', 'role']);

      res.status(201).json({
        success: true,
        message: 'Tenant registered successfully',
        data: { tenantId: tenant.id, subdomain: tenant.subdomain, adminUser }
      });
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ success: false, message: 'Subdomain or email exists' });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // API 2: POST /api/auth/login (PUBLIC)
  login: async (req, res) => {
    const { email, password, tenantSubdomain } = req.body;
    
    try {
      // Find tenant
      const tenant = await knex('tenants').where('subdomain', tenantSubdomain).first();
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found' });
      }

      // Find user
      const user = await knex('users')
        .where({ tenant_id: tenant.id, email })
        .first();
      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, tenantId: user.tenant_id || null, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, tenantId: user.tenant_id },
          token,
          expiresIn: 86400
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // API 3: GET /api/auth/me (AUTH REQUIRED)
  me: async (req, res) => {
    try {
      const user = await knex('users')
        .where('id', req.user.id)
        .select('id', 'email', 'full_name', 'role', 'is_active', 'tenant_id')
        .first();

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      let tenant = null;
      if (user.tenant_id) {
        tenant = await knex('tenants')
          .where('id', user.tenant_id)
          .select('id', 'name', 'subdomain', 'subscription_plan', 'max_users', 'max_projects')
          .first();
      }

      res.json({
        success: true,
        data: { ...user, tenant }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // API 4: POST /api/auth/logout (AUTH REQUIRED)
  logout: async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  }
};
