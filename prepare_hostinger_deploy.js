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
ALLOWED_ORIGINS=https://indiatourismlive.com,http://indiatourismlive.com,https://www.indiatourismlive.com,http://www.indiatourismlive.com,https://antiquewhite-seal-759506.hostingersite.com,http://antiquewhite-seal-759506.hostingersite.com,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Hostinger MySQL Database Credentials
DB_DRIVER=mysql
DB_HOST=localhost
DB_NAME=u276796116_india_tour
DB_USER=u276796116_india_tour
DB_PASS=Qubnix@123

# Target Deployment Domain
DEPLOY_DOMAIN=indiatourismlive.com
`;

fs.writeFileSync(path.join(backendDest, '.env'), prodEnvContent, 'utf8');
fs.writeFileSync(path.join(deployDir, '.env'), prodEnvContent, 'utf8');

const backendHtaccess = path.join(backendSrc, '.htaccess');
if (fs.existsSync(backendHtaccess)) {
  fs.copyFileSync(backendHtaccess, path.join(backendDest, '.htaccess'));
}

// Copy api, helpers, config, data, and uploads to deployDir root for fail-safe relative paths
console.log('4. Creating root /api, /helpers, /config, /data, and /uploads mapping...');
const apiSrc = path.join(backendSrc, 'api');
const apiDest = path.join(deployDir, 'api');
copyRecursiveSync(apiSrc, apiDest);

const helpersSrc = path.join(backendSrc, 'helpers');
const helpersDest = path.join(deployDir, 'helpers');
copyRecursiveSync(helpersSrc, helpersDest);

const configSrc = path.join(backendSrc, 'config');
const configDest = path.join(deployDir, 'config');
copyRecursiveSync(configSrc, configDest);

const dataSrc = path.join(backendSrc, 'data');
const dataDest = path.join(deployDir, 'data');
copyRecursiveSync(dataSrc, dataDest);

const uploadsSrc = path.join(backendSrc, 'uploads');
const uploadsDest = path.join(deployDir, 'uploads');
if (!fs.existsSync(uploadsDest)) fs.mkdirSync(uploadsDest, { recursive: true });
if (fs.existsSync(uploadsSrc)) copyRecursiveSync(uploadsSrc, uploadsDest);

// Copy schema.sql to root as well for convenience
const schemaSrc = path.join(backendSrc, 'schema.sql');
if (fs.existsSync(schemaSrc)) {
  fs.copyFileSync(schemaSrc, path.join(deployDir, 'schema.sql'));
}


console.log('5. Packaging into deploy_hostinger.zip with forward-slash POSIX paths...');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  // Use tar.exe which is native in Windows 10/11 and strictly preserves standard POSIX forward slashes '/'
  // so Linux servers (Hostinger) unpack subdirectories correctly (e.g. assets/, fonts/, api/)
  const items = fs.readdirSync(deployDir).map(f => `"${f}"`).join(' ');
  execSync(`tar.exe -a -c -f "${zipPath}" -C "${deployDir}" ${items}`);
  const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
  console.log(`Success! deploy_hostinger.zip generated (${sizeMb} MB) with standard forward slashes.`);
} catch (err) {
  console.log('tar.exe note:', err.message, '- falling back to PowerShell zip archive');
  execSync(`powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${deployDir}', '${zipPath}')"`);
}

console.log('All deployment files ready in hostinger_deploy/ and deploy_hostinger.zip');
