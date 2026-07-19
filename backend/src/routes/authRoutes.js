const express = require('express');
const { authMiddleware, findUserByEmail, registerUser, signToken, verifyPassword } = require('../auth/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (role && role !== user.role) {
    return res.status(403).json({ error: 'Selected role does not match account' });
  }

  const token = signToken({ sub: user.id, role: user.role });
  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
});

router.post('/register', (req, res) => {
  try {
    const requestedRole = req.body.role === 'admin' ? 'admin' : 'user';
    const user = registerUser({ email: req.body.email, password: req.body.password, role: requestedRole, name: req.body.name || 'New User' });
    const token = signToken({ sub: user.id, role: user.role });
    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/me', authMiddleware(), (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email, role: req.user.role, name: req.user.name } });
});

module.exports = router;
