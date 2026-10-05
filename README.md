# K9 Guardian ReactJS

A standalone JavaScript project: React 19 frontend, Vite, Tailwind CSS and a
Node.js backend. All files needed by the app are in this folder.

## Local development

Install Node.js 22.12 or newer, then run from this folder:

    npm install
    npm run dev

One command starts both React (http://localhost:5173) and the Node.js backend
(http://localhost:3001). Vite proxies /api requests to Node.js.

On Windows, use npm.cmd if PowerShell blocks npm.ps1.

## Run the built application

    npm run build
    npm start

Open http://localhost:3001. Node.js serves both the built React website and API.
No Replit, pnpm workspace, external server or database is required.
You can move this entire folder to another location or computer.

Set PORT to change the backend port. Set HOST=0.0.0.0 if you want the server
accessible from other computers. The default host is local only.

## Project files

- src/main.jsx: React entry point
- src/App.jsx: pages, routing and enquiry form
- src/components/: JavaScript/JSX React components
- src/hooks/ and src/lib/: JavaScript hooks and utilities
- src/index.css: styles
- public/: images and favicon
- server/index.js: Node.js API and production web server
- scripts/dev.js: starts the frontend and backend together
- vite.config.js: frontend build configuration

## Enquiries

POST /api/enquiries validates and saves the contact form to data/enquiries.jsonl,
one JSON record per line. Success is displayed only after the server saves it.
The data folder is private to the backend and excluded from Git.
GET /api/health checks that the backend is running.

Submissions are stored locally; email delivery is not configured.
Keep the data folder on persistent storage when deploying.
The existing placeholder contact details remain in the website.
