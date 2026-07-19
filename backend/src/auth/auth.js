const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'echoshield-dev-secret';
const users = [
  {
    id: 'admin-1',
    email: 'admin@echoshield.ai',
    passwordHash: createHash('demo1234'),
    role: 'admin',
    name: 'System Admin'
  },
  {
    id: 'user-1',
    email: 'user@echoshield.ai',
    passwordHash: createHash('demo1234'),
    role: 'user',
    name: 'Field User'
  }
];

function createHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, passwordHash) {
  return createHash(password) === passwordHash;
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

function registerUser({ email, password, role = 'user', name = 'New User' }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (findUserByEmail(email)) {
    throw new Error('User already exists');
  }

  const user = {
    id: `user-${Date.now()}`,
    email,
    passwordHash: createHash(password),
    role: role === 'admin' ? 'user' : role,
    name
  };

  users.push(user);
  return user;
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

function authMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = verifyToken(token);
      const user = getUserById(decoded.sub || decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = {
  authMiddleware,
  createHash,
  verifyPassword,
  signToken,
  verifyToken,
  findUserByEmail,
  registerUser,
  getUserById
};
