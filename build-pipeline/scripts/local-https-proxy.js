import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import path from 'node:path';

const PROXY_PORT = 7072;
const TARGET_PORT = 7071; // Azure Functions default port

const projectRoot = path.resolve(process.cwd());
const certPath = path.join(projectRoot, '.certs', 'sharethrift.localhost.pem');
const keyPath = path.join(projectRoot, '.certs', 'sharethrift.localhost-key.pem');

// Validate certificate files exist
if (!fs.existsSync(certPath)) {
 console.error(`Error: Certificate file not found: ${certPath}`);
 console.error('Run: pnpm run setup:certs');
 process.exit(1);
}

if (!fs.existsSync(keyPath)) {
 console.error(`Error: Certificate key file not found: ${keyPath}`);
 console.error('Run: pnpm run setup:certs');
 process.exit(1);
}

// Check if port is already in use before starting
function checkPortInUse(port) {
 return new Promise((resolve) => {
  const tester = net.createServer()
   .once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
     resolve(true);
    } else {
     resolve(false);
    }
   })
   .once('listening', () => {
    tester.close();
    resolve(false);
   })
   .listen(port);
 });
}

function getSafePath(url) {
 if (typeof url !== 'string') {
  return '/';
 }

 // Only allow relative paths
 if (!url.startsWith('/')) {
  return '/';
 }

 return url;
}


const portInUse = await checkPortInUse(PROXY_PORT);
if (portInUse) {
 console.log(`✓ HTTPS proxy already running on port ${PROXY_PORT}`);
 process.exit(0);
}
const server = https.createServer(
 {
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath),
 },
 (req, res) => {
  const host = req.headers.host?.split(':')[0];
  if (host !== 'data-access.sharethrift.localhost') {
   res.writeHead(404);
   res.end('Not Found');
   return;
  }

  const options = {
   hostname: 'localhost',
   port: TARGET_PORT,           // trusted
   method: req.method,
   path: getSafePath(req.url),  // constrained
   headers: {
    'host': 'localhost',
    'x-forwarded-proto': 'https',
    'x-forwarded-host': 'data-access.sharethrift.localhost:7072',
    'x-forwarded-for': req.socket.remoteAddress || '127.0.0.1',
    ...(req.headers['content-type'] && { 'content-type': req.headers['content-type'] }),
    ...(req.headers['content-length'] && { 'content-length': req.headers['content-length'] }),
    ...(req.headers.authorization && { 'authorization': req.headers.authorization }),
    ...(req.headers.origin && { 'origin': req.headers.origin }),
    ...(req.headers['access-control-request-method'] && { 'access-control-request-method': req.headers['access-control-request-method'] }),
    ...(req.headers['access-control-request-headers'] && { 'access-control-request-headers': req.headers['access-control-request-headers'] }),
   },
  };

  const proxy = http.request(options, (proxyRes) => {
   res.writeHead(proxyRes.statusCode, proxyRes.headers);
   proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
   console.error('Proxy error:', err);
   res.writeHead(502);
   res.end('Bad Gateway');
  });

  req.pipe(proxy);
 }
);


// Handle server startup errors
server.on('error', (err) => {
 if (err.code === 'EADDRINUSE') {
  console.error(`Error: Port ${PROXY_PORT} is already in use`);
  console.error('Another instance may be running. Stop it or use a different port.');
 } else if (err.code === 'EACCES') {
  console.error(`Error: Permission denied to bind to port ${PROXY_PORT}`);
  console.error('Try using a port > 1024 or run with elevated privileges.');
 } else {
  console.error('Server error:', err);
 }
 process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
 console.log('\nShutting down HTTPS proxy...');
 server.close(() => {
  console.log('HTTPS proxy stopped');
  process.exit(0);
 });
});

process.on('SIGTERM', () => {
 console.log('\nShutting down HTTPS proxy...');
 server.close(() => {
  console.log('HTTPS proxy stopped');
  process.exit(0);
 });
});

server.listen(PROXY_PORT, () => {
 console.log(`HTTPS proxy daemon listening on https://data-access.sharethrift.localhost:${PROXY_PORT}`);
 console.log(`Proxying to http://localhost:${TARGET_PORT}`);
});
 