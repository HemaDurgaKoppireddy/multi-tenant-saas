const jwt = require('jsonwebtoken');
const { query } = require('../utils/db');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await query(
      `SELECT u.*, t.id as tenant_id, t.name as tenant_name, t.subdomain, 
              t.subscription_plan, t.max_users, t.max_projects 
       FROM users u 
       LEFT JOIN tenants t ON u.tenant_id = t.id 
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );

    if (!user.rows[0]) return res.status(401).json({ success: false, message: 'Invalid token' });

    req.user = {
      id: user.rows[0].id,
      tenantId: user.rows[0].tenant_id,
      role: user.rows[0].role,
      email: user.rows[0].email,
      fullName: user.rows[0].full_name,
      tenant: user.rows[0]
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token expired or invalid' });
  }
};
