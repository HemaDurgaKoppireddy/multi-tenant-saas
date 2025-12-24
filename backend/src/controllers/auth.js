const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const knex = require('../utils/db');
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res, next) => {
  const { email, password, tenantSubdomain } = req.body;

  if (!email || !password || !tenantSubdomain) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and tenantSubdomain are required'
    });
  }

  try {
    // Find tenant
    const tenant = await knex('tenants')
      .where({ subdomain: tenantSubdomain })
      .first();

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    if (tenant.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Tenant is not active'
      });
    }

    // Find user
    const user = await knex('users')
      .where({ email, tenant_id: tenant.id })
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: tenant.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: tenant.id
        },
        token,
        expiresIn: 86400
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) {
  return res.status(500).json({ error: 'req.user is missing' });
}
    console.log('REQ.USER 👉', req.user); // 👈 ADD THIS
    const userId = req.user.id;
    const user = await knex('users')
      .join('tenants', 'users.tenant_id', 'tenants.id')
      .select(
        'users.id',
        'users.email',
        'users.full_name',
        'users.role',
        'users.is_active',
        'tenants.id as tenant_id',
        'tenants.name as tenant_name',
        'tenants.subdomain',
        'tenants.subscription_plan',
        'tenants.max_users',
        'tenants.max_projects'
      )
      .where('users.id', userId )
      .first();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account inactive' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: user.is_active,
        tenant: {
          id: user.tenant_id,
          name: user.tenant_name,
          subdomain: user.subdomain,
          subscriptionPlan: user.subscription_plan,
          maxUsers: user.max_users,
          maxProjects: user.max_projects,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;

    // Log audit action
    await knex('audit_logs').insert({
      id: require('uuid').v4(),
      user_id: userId,
      tenant_id: tenantId,
      action: 'LOGOUT',
      entity_type: 'auth',
      entity_id: userId,
      created_at: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    next(err);
  }
};

