const path = require('path');
const fs = require('fs');
const Yaml = require('yaml');

const appPath = path.join(__dirname, '..');

module.exports = Yaml.parse(fs.readFileSync(
  path.join(appPath, process.env.SETTINGS),
  { encoding: 'utf-8' }
));
