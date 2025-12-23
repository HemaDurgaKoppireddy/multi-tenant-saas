-- Super Admin (tenant_id = NULL)
INSERT INTO users (tenant_id, email, password_hash, full_name, role) 
VALUES 
(NULL, 'superadmin@system.com', '\$2b\$12\$...', 'Super Administrator', 'super_admin')
ON CONFLICT DO NOTHING;

-- Demo Tenant
INSERT INTO tenants (name, subdomain, status, subscription_plan, max_users, max_projects) 
VALUES ('Demo Company', 'demo', 'active', 'pro', 25, 15)
ON CONFLICT (subdomain) DO NOTHING;

-- Demo Tenant Admin
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
SELECT t.id, 'admin@demo.com', '\$2b\$12\$...', 'Demo Admin', 'tenant_admin'
FROM tenants t WHERE t.subdomain = 'demo'
ON CONFLICT (tenant_id, email) DO NOTHING;

-- Demo Users (2 regular users)
INSERT INTO users (tenant_id, email, password_hash, full_name, role)
SELECT t.id, 'user1@demo.com', '\$2b\$12\$...', 'Demo User 1', 'user'
FROM tenants t WHERE t.subdomain = 'demo'
ON CONFLICT (tenant_id, email) DO NOTHING;

INSERT INTO users (tenant_id, email, password_hash, full_name, role) 
SELECT t.id, 'user2@demo.com', '\$2b\$12\$...', 'Demo User 2', 'user'
FROM tenants t WHERE t.subdomain = 'demo' 
ON CONFLICT (tenant_id, email) DO NOTHING;
