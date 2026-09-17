// Custom server.js optimized for cPanel Passenger / Phusion Passenger Node.js deployments
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

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
