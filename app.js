// app.js
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Request Logging Middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request details
  console.log(`\n[${timestamp}] ${req.method} ${req.originalUrl || req.url}`);
  const clientIP = req.ip || req.socket?.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || 'Unknown';
  console.log(`  IP: ${clientIP}`);
  console.log(`  User-Agent: ${req.get('user-agent') || 'Unknown'}`);
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`  Query Params:`, req.query);
  }
  
  // Log request body for POST/PUT/PATCH requests
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (Object.keys(req.body || {}).length > 0) {
      console.log(`  Body:`, JSON.stringify(req.body, null, 2));
    }
  }
  
  // Log response details when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(`  Status: ${statusColor}${res.statusCode}\x1b[0m | Duration: ${duration}ms`);
  });
  
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Favicon route - return emoji as SVG
app.get("/favicon.ico", (req, res) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <text y=".9em" font-size="90">🛍️</text>
  </svg>`;
  res.type('image/svg+xml');
  res.send(svg);
});

// Static
app.use(express.static(join(__dirname, "public")));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

export default app;
