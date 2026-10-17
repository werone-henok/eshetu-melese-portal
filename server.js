// Custom server.js optimized for cPanel Passenger / Phusion Passenger Node.js deployments
const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const next = require('next');

// Auto-extract deploy.zip if delivered via fast archive deployment
const zipPath = path.join(__dirname, 'deploy.zip');
if (fs.existsSync(zipPath)) {
  try {
    console.log('📦 Found deploy.zip, auto-extracting bundle...');
    try {
      execSync('unzip -o deploy.zip', { cwd: __dirname, stdio: 'inherit' });
    } catch (unzipErr) {
      console.log('unzip binary failed or not found, falling back to python3 zipfile...');
      execSync('python3 -c "import zipfile; zipfile.ZipFile(\'deploy.zip\').extractall(\'.\')"', { cwd: __dirname, stdio: 'inherit' });
    }
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    console.log('✅ deploy.zip extracted successfully!');
  } catch (err) {
    console.error('Failed to extract deploy.zip:', err);
  }
}

// CRITICAL FOR CPANEL PERFORMANCE: Ensure Next.js NEVER runs in dev/compiler mode on cPanel
process.env.NODE_ENV = 'production';
const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port, quiet: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Server ready on http://${hostname}:${port}`);
    });
});
