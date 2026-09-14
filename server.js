const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        ips.push({ name, ip: net.address });
      }
    }
  }
  return ips;
}

const server = http.createServer((req, res) => {
  // Add CORS headers so mobile webviews or testing tools can load assets smoothly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];

  // API endpoint for dynamic mobile / cross-device network detection
  if (reqPath === '/api/network-info') {
    const localIps = getLocalIpAddresses();
    const primaryIp = localIps.length > 0 ? localIps[0].ip : '127.0.0.1';
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      port: PORT,
      ip: primaryIp,
      ips: localIps,
      url: `http://${primaryIp}:${PORT}/`
    }));
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, HOST, () => {
  const localIps = getLocalIpAddresses();
  console.log('\n======================================================');
  console.log('🚀 MANOJ\'S PORTFOLIO SERVER IS LIVE & READY FOR MOBILE!');
  console.log('======================================================');
  console.log(`💻 On This Computer:   http://localhost:${PORT}/`);
  localIps.forEach(({ name, ip }) => {
    console.log(`📱 On Mobile / Other:  http://${ip}:${PORT}/  (Interface: ${name})`);
  });
  console.log('======================================================\n');
});
