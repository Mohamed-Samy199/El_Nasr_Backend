import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss";
import compression from "compression";

import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import quoteRequestRoutes from "./modules/quote-request/quoteRequest.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

import { ApiError } from "./utils/ApiError.js";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

// ── Security & Parsing Middlewares ────────────────────────────────────────────
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
    },
  })
);

// ── XSS Prevention — sanitize body strings ────────────────────────────────────
app.use((req, _res, next) => {
  if (req.body) sanitizeObject(req.body);
  next();
});

const sanitizeObject = (obj) => {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
};

// ── CORS ──────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL, // مثال: http://192.168.1.10:5173 على الشبكة الداخلية
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / server-to-server
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── NoSQL Injection Prevention ─────────────────────────────────────────────────
app.use(mongoSanitize());

app.use("/api", generalLimiter);

if (process.env.NODE_ENV === process.env.DEVELOPMENT) {
  app.use(morgan("dev"));
}

app.use(compression());
// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/quote-requests", quoteRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Nasr API is running." });
});

// catch-all for unknown routes
app.all("*", (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found.`));
});

// ── Global Error Handler (must be last) ───────────────────────────────────────

app.use(errorMiddleware);

export default app;