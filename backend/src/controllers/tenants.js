const knex = require('../utils/db');

exports.getTenantDetails = async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const user = req.user;

    // 🔐 Authorization check
    const isSameTenant = user.tenantId === tenantId;
    const isSuperAdmin = user.role === 'super_admin';

    if (!isSameTenant && !isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    // 🔎 Fetch tenant
    const tenant = await knex('tenants')
      .where({ id: tenantId })
      .first();

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // 📊 Stats calculations
    const [{ count: totalUsers }] = await knex('users')
      .where({ tenant_id: tenantId })
      .count();

    const [{ count: totalProjects }] = await knex('projects')
      .where({ tenant_id: tenantId })
      .count();

    const [{ count: totalTasks }] = await knex('tasks')
      .join('projects', 'tasks.project_id', 'projects.id')
      .where('projects.tenant_id', tenantId)
      .count();

    return res.status(200).json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        subscriptionPlan: tenant.subscription_plan,
        maxUsers: tenant.max_users,
        maxProjects: tenant.max_projects,
        createdAt: tenant.created_at,
        stats: {
          totalUsers: Number(totalUsers),
          totalProjects: Number(totalProjects),
          totalTasks: Number(totalTasks)
        }
      }
    });

  } catch (err) {
    next(err);
  }
};
