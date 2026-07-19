const express = require('express');

const router = express.Router();

const users = [
  { id: 'u1', email: 'admin@echoshield.ai', password: 'demo1234', role: 'admin' },
  { id: 'u2', email: 'operator@echoshield.ai', password: 'demo1234', role: 'operator' }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((entry) => entry.email === email && entry.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json({
    token: `demo-token-${user.id}`,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

router.get('/me', (req, res) => {
  res.json({ user: { id: 'u1', email: 'admin@echoshield.ai', role: 'admin' } });
});

module.exports = router;
