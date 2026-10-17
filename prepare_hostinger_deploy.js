const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const deployDir = path.join(rootDir, 'hostinger_deploy');
const zipPath = path.join(rootDir, 'deploy_hostinger.zip');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('1. Preparing hostinger_deploy directory...');
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

console.log('2. Copying frontend build artifacts from frontend/dist...');
const distDir = path.join(rootDir, 'frontend', 'dist');
copyRecursiveSync(distDir, deployDir);

// Explicitly ensure .htaccess is copied if hidden
const htaccessSource = path.join(distDir, '.htaccess');
if (fs.existsSync(htaccessSource)) {
  fs.copyFileSync(htaccessSource, path.join(deployDir, '.htaccess'));
}

console.log('3. Copying backend PHP services and configuration...');
const backendSrc = path.join(rootDir, 'backend');
const backendDest = path.join(deployDir, 'backend');
copyRecursiveSync(backendSrc, backendDest);

// Explicitly write production .env for Hostinger MySQL
const prodEnvContent = `APP_ENV=production
APP_SECRET=india_tour_secure_production_secret_key_2026_qubnix
ALLOWED_ORIGINS=https://antiquewhite-seal-759506.hostingersite.com,http://antiquewhite-seal-759506.hostingersite.com,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Hostinger MySQL Database Credentials
DB_DRIVER=mysql
DB_HOST=localhost
DB_NAME=u276796116_india_tour
DB_USER=u276796116_india_tour
DB_PASS=Qubnix@123

# Target Deployment Domain
DEPLOY_DOMAIN=antiquewhite-seal-759506.hostingersite.com
`;

fs.writeFileSync(path.join(backendDest, '.env'), prodEnvContent, 'utf8');
fs.writeFileSync(path.join(deployDir, '.env'), prodEnvContent, 'utf8');

const backendHtaccess = path.join(backendSrc, '.htaccess');
if (fs.existsSync(backendHtaccess)) {
  fs.copyFileSync(backendHtaccess, path.join(backendDest, '.htaccess'));
}

// Copy api, helpers, and config to deployDir root for fail-safe relative paths
console.log('4. Creating root /api, /helpers, and /config mapping...');
const apiSrc = path.join(backendSrc, 'api');
const apiDest = path.join(deployDir, 'api');
copyRecursiveSync(apiSrc, apiDest);

const helpersSrc = path.join(backendSrc, 'helpers');
const helpersDest = path.join(deployDir, 'helpers');
copyRecursiveSync(helpersSrc, helpersDest);

const configSrc = path.join(backendSrc, 'config');
const configDest = path.join(deployDir, 'config');
copyRecursiveSync(configSrc, configDest);


console.log('5. Packaging into deploy_hostinger.zip...');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  execSync(`powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${deployDir}', '${zipPath}')"`);
  const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
  console.log(`Success! deploy_hostinger.zip generated (${sizeMb} MB).`);
} catch (err) {
  console.log('Compression note:', err.message);
}

console.log('All deployment files ready in hostinger_deploy/ and deploy_hostinger.zip');
