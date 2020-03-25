const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const YARN_DIR = path.join(__dirname, '.yarn');
const RELEASES_DIR = path.join(YARN_DIR, 'releases');
const ONE_DAY = 24 * 60 * 60 * 1000;
let stats;

try {
 stats = fs.statSync(RELEASES_DIR);
} catch {}

const yarnInstallCmd = stats ? `yarn set version latest`: `yarn set version berry`;

if (!stats || (Date.now() - stats.mtime) >= ONE_DAY) {
  fs.renameSync('.yarnrc.yml', '.yarnrc.yml.bak');
  execSync(yarnInstallCmd);
  fs.renameSync('.yarnrc.yml.bak', '.yarnrc.yml');
}

const YARN_BUNDLE = path.join(RELEASES_DIR, fs.readdirSync(RELEASES_DIR)[0]);
require(YARN_BUNDLE);
