const fs = require('fs');
const path = require('path');

const evidenceDir = path.join(__dirname, '../../storage/evidence');

function ensureStorage() {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

function storeEvidence(filename, contentBase64) {
  ensureStorage();
  const buffer = Buffer.from(contentBase64, 'base64');
  const targetPath = path.join(evidenceDir, filename);
  fs.writeFileSync(targetPath, buffer);
  return { path: targetPath, size: buffer.length };
}

function listEvidence() {
  ensureStorage();
  return fs.readdirSync(evidenceDir).map((name) => ({ name }));
}

module.exports = {
  storeEvidence,
  listEvidence
};
