import http from 'node:http';
import { readFile, stat, mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const contentTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain',
};
const services = new Set(['Premises security', 'Event security', 'Mobile patrols', 'Personal protection', 'Not sure yet']);

function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
}

export function createAppServer({ distDir = path.join(root, 'dist'), dataDir = path.join(root, 'data') } = {}) {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/health' && req.method === 'GET') {
        return json(res, 200, { status: 'ok' });
      }
      if (url.pathname === '/api/enquiries' && req.method === 'POST') {
        if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) {
          return json(res, 415, { error: 'Send the enquiry as JSON.' });
        }
        let body = '';
        for await (const chunk of req) {
          body += chunk.toString();
          if (Buffer.byteLength(body) > 16384) return json(res, 413, { error: 'Your enquiry is too long.' });
        }
        let input;
        try { input = JSON.parse(body); }
        catch { return json(res, 400, { error: 'Invalid JSON.' }); }
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
          return json(res, 400, { error: 'Invalid enquiry.' });
        }
        const enquiry = {};
        for (const [field, max] of Object.entries({ name: 200, email: 254, service: 100, message: 5000 })) {
          if (typeof input[field] !== 'string' || !input[field].trim() || input[field].trim().length > max) {
            return json(res, 400, { error: 'Please provide a valid ' + field + '.' });
          }
          enquiry[field] = input[field].trim();
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email) || !services.has(enquiry.service)) {
          return json(res, 400, { error: 'Please check your email address and service.' });
        }
        enquiry.id = randomUUID();
        enquiry.createdAt = new Date().toISOString();
        await mkdir(dataDir, { recursive: true });
        await appendFile(path.join(dataDir, 'enquiries.jsonl'), JSON.stringify(enquiry) + '\n', { mode: 0o600 });
        return json(res, 201, { id: enquiry.id, message: 'Enquiry received.' });
      }
      if (url.pathname.startsWith('/api/')) return json(res, 404, { error: 'API route not found.' });
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return json(res, 405, { error: 'Method not allowed.' });
      }
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); }
      catch { return json(res, 400, { error: 'Invalid path.' }); }
      const base = path.resolve(distDir);
      let file = path.resolve(base, '.' + pathname);
      if (file !== base && !file.startsWith(base + path.sep)) return json(res, 403, { error: 'Forbidden.' });
      try {
        if (!(await stat(file)).isFile()) file = path.join(base, 'index.html');
      } catch {
        if (path.extname(pathname)) return json(res, 404, { error: 'File not found.' });
        file = path.join(base, 'index.html');
      }
      let contents;
      try { contents = await readFile(file); }
      catch { return json(res, 503, { error: 'Build the website first with npm run build.' }); }
      res.writeHead(200, {
        'Content-Type': contentTypes[path.extname(file)] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(req.method === 'HEAD' ? undefined : contents);
    } catch (error) {
      console.error('Request failed:', error.message);
      if (!res.headersSent) json(res, 500, { error: 'Unable to complete the request. Please try again.' });
      else res.end();
    }
  });
}

export function startServer() {
  const port = Number(process.env.PORT || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
  const server = createAppServer();
  server.listen(port, process.env.HOST || '127.0.0.1', () => {
    console.log('Node.js server: http://localhost:' + port);
  });
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startServer();
