require('dotenv').config();
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/apiRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

const frontendDistPath = path.join(__dirname, '../frontend/dist');
const frontendPublicPath = path.join(__dirname, '../frontend/public');
const frontendStaticPath = fs.existsSync(frontendDistPath) ? frontendDistPath : frontendPublicPath;

app.use(express.static(frontendStaticPath));
app.get('/', (req, res) => res.sendFile(path.join(frontendStaticPath, 'index.html')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  return res.sendFile(path.join(frontendStaticPath, 'index.html'));
});

function startServer(portNumber = port) {
  const server = app.listen(portNumber, () => {
    const actualPort = server.address().port;
    console.log(`EchoShield backend running on http://localhost:${actualPort}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
