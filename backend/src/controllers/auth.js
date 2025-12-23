const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const knex = require('../utils/db');

exports.registerTenant = async (req, res, next) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;

  if (!tenantName || !subdomain || !adminEmail || !adminPassword || !adminFullName) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    await knex.transaction(async (trx) => {
      // Check if subdomain or email exists
      const existingTenant = await trx('tenants').where({ subdomain }).first();
      const existingUser = await trx('users').where({ email: adminEmail }).first();

      if (existingTenant || existingUser) {
        return res.status(409).json({ success: false, message: 'Subdomain or email already exists' });
      }

      // Create tenant
      const tenantId = uuid();
      await trx('tenants').insert({
        id: tenantId,
        name: tenantName,
        subdomain,
        status: 'active',
        subscription_plan: 'free', // default
        max_users: 5,
        max_projects: 10,
      });

      // Create tenant admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminId = uuid();

      await trx('users').insert({
        id: adminId,
        tenant_id: tenantId,
        email: adminEmail,
        password_hash: hashedPassword,
        full_name: adminFullName,
        role: 'tenant_admin',
        is_active: true,
      });

      res.status(201).json({
        success: true,
        message: 'Tenant registered successfully',
        data: {
          tenantId,
          subdomain,
          adminUser: {
            id: adminId,
            email: adminEmail,
            fullName: adminFullName,
            role: 'tenant_admin',
          },
        },
      });
    });
  } catch (err) {
    next(err);
  }
};
