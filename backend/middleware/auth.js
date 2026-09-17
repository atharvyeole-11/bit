const jwt = require('jsonwebtoken');

const protect = (roles = []) => {
  return (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded; // Assumes payload contains { id, role }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'User role not authorized to access this route' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Not authorized' });
    }
  };
};

module.exports = { protect };
