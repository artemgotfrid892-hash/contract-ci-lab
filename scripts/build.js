'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const pkg = require('../package.json');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// Что попадает в поставку (отсутствующие файлы пропускаются)
const include = ['src', 'package.json', 'package-lock.json', 'openapi.yaml'];
for (const item of include) {
  const from = path.join(root, item);
  if (fs.existsSync(from)) {
    fs.cpSync(from, path.join(dist, item), { recursive: true });
  }
}

const info = {
  name: pkg.name,
  version: pkg.version,
  commit: process.env.GITHUB_SHA || process.env.CI_COMMIT_SHA || 'local',
  ref: process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_REF_NAME || 'local',
  builtAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(dist, 'build-info.json'), JSON.stringify(info, null, 2));

console.log('Build complete:', info);