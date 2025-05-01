// What this middleware Does ;-
//      const protect: (Checks if JWT token exists, Verifies the token, Finds the user based on the token's ID
//      and if OK, attaches req.user and allows access
//      const authorizeRoles: (Checks if the logged-in user's role matches allowed roles, Otherwise blocks access with 'Forbidden' error )

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user.role} not allowed to access this resource` });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
