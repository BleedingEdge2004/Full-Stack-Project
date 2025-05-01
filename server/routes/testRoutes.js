const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you have accessed a protected route!` });
});

router.get('/admin-only', protect, authorizeRoles('Admin'), (req, res) => {
  res.json({ message: `Hello Admin ${req.user.name}, welcome to the admin Jurisdiction!` });
});

module.exports = router;
