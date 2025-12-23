-- Super Admin (no tenant)
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, is_active) VALUES
(gen_random_uuid(), NULL, 'superadmin@system.com', '\$2b\$12\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Administrator', 'super_admin', true)
ON CONFLICT DO NOTHING;

-- Demo Tenant
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects) VALUES
(gen_random_uuid(), 'Demo Company', 'demo', 'active', 'pro', 25, 15)
ON CONFLICT (subdomain) DO NOTHING;

-- Demo Admin (bcrypt.hash('Demo@123', 12))
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, is_active)
SELECT gen_random_uuid(), t.id, 'admin@demo.com', '\$2b\$12\$1v7wQjK5z3fX9pL2mN8rYu8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X', 'Demo Admin', 'tenant_admin', true
FROM tenants t WHERE t.subdomain = 'demo' ON CONFLICT DO NOTHING;

-- Demo Users
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, is_active)
SELECT gen_random_uuid(), t.id, 'user1@demo.com', '\$2b\$12\$abc123...', 'Demo User 1', 'user', true
FROM tenants t WHERE t.subdomain = 'demo' ON CONFLICT DO NOTHING;
