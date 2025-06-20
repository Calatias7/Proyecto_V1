import http from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { cwd } from 'process';

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

const port = process.env.PORT || 3000;
const root = cwd();

const server = http.createServer(async (req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = join(root, urlPath);
  try {
    const data = await readFile(filePath);
    const type = mimeTypes[extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
