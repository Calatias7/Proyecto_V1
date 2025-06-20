import http from 'http';
import { readFile } from 'fs/promises';
import { extname, join, resolve } from 'path';
import { cwd } from 'process';
import { fileURLToPath } from 'url';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const root = cwd();

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

function logRequest(req) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
}

async function handler(req, res) {
  logRequest(req);
  const urlPath = decodeURIComponent(req.url === '/' ? '/index.html' : req.url);
  const safePath = resolve(join(root, '.' + urlPath));
  if (!safePath.startsWith(root)) {
    res.writeHead(403, securityHeaders);
    res.end('Forbidden');
    return;
  }
  try {
    const data = await readFile(safePath);
    const type = mimeTypes[extname(safePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, ...securityHeaders });
    res.end(data);
  } catch {
    res.writeHead(404, securityHeaders);
    res.end('Not found');
  }
}

export function createServer() {
  return http.createServer(handler);
}

const isMain = fileURLToPath(import.meta.url) === process.argv[1];
if (isMain && process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  const server = createServer();
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}
