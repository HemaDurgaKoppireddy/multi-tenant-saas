const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

exports.seed = async function (knex) {
  await knex('audit_logs').del();
  await knex('tasks').del();
  await knex('projects').del();
  await knex('users').del();
  await knex('tenants').del();

  const superAdminId = uuid();
  const tenantId = uuid();

  // Super Admin
  await knex('users').insert({
    id: superAdminId,
    tenant_id: null,
    email: 'superadmin@system.com',
    password_hash: await bcrypt.hash('Admin@123', 10),
    full_name: 'System Admin',
    role: 'super_admin'
  });

  // Tenant
  await knex('tenants').insert({
    id: tenantId,
    name: 'Demo Company',
    subdomain: 'demo',
    status: 'active',
    subscription_plan: 'pro',
    max_users: 10,
    max_projects: 20
  });

  // Tenant Admin + Users
  const users = [
    {
      id: uuid(),
      tenant_id: tenantId,
      email: 'admin@demo.com',
      password_hash: await bcrypt.hash('Demo@123', 10),
      full_name: 'Demo Admin',
      role: 'tenant_admin'
    },
    {
      id: uuid(),
      tenant_id: tenantId,
      email: 'user1@demo.com',
      password_hash: await bcrypt.hash('User@123', 10),
      full_name: 'User One',
      role: 'user'
    },
    {
      id: uuid(),
      tenant_id: tenantId,
      email: 'user2@demo.com',
      password_hash: await bcrypt.hash('User@123', 10),
      full_name: 'User Two',
      role: 'user'
    }
  ];

  await knex('users').insert(users);
};
