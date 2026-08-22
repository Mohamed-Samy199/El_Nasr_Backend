# El Nasr Backend API

Backend API for the El Nasr (Packaging Agricultural Crops) website — a B2B platform for showcasing agricultural products (legumes, seeds, and other crops) and managing quote requests from international traders and importers. Built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seeding the Database](#seeding-the-database)
- [Running the Server](#running-the-server)
- [API Overview](#api-overview)
- [Authentication Flow](#authentication-flow)
- [Roles & Permissions](#roles--permissions)
- [Bilingual Fields](#bilingual-fields)
- [Product Status Flow](#product-status-flow)
- [Image Uploads](#image-uploads)
- [Pagination](#pagination)
- [Security](#security)
- [Notes & Decisions](#notes--decisions)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| Validation | Joi |
| Image Storage | Cloudinary |
| Security | Helmet, express-mongo-sanitize, xss, express-rate-limit, CORS |
| Dev Tools | nodemon, morgan |

---

## Project Structure

```
src/
├── config/
│   ├── .env
│   ├── env.config.js         # loads & validates all environment variables
│   └── cloudinary.js         # Cloudinary SDK configuration
│
├── db/
│   ├── connection.db.js      # MongoDB connection
│   └── database.repository.js # generic reusable CRUD/query functions
│
├── models/
│   ├── User.model.js
│   ├── Category.model.js
│   ├── Product.model.js
│   └── QuoteRequest.model.js
│
├── middlewares/
│   ├── auth.middleware.js         # verifyToken
│   ├── role.middleware.js         # isAdmin, isEditor
│   ├── upload.middleware.js       # multer (memory storage)
│   ├── validate.middleware.js     # Joi schema validator
│   ├── bootstrapOrAdmin.middleware.js  # allows first admin registration
│   ├── rateLimit.middleware.js    # generalLimiter, quoteRequestLimiter
│   └── error.middleware.js        # global error handler
│
├── modules/
│   ├── auth/
│   ├── category/
│   ├── product/
│   ├── upload/
│   ├── quote-request/
│   └── dashboard/
│       (each module contains: *.controller.js, *.routes.js, *.service.js, *.validation.js)
│
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── generateToken.js
│   └── slugify.js
│
└── app.bootstrap.js          # Express app setup (middlewares + routes)

index.js                      # entry point
seed.js                       # database seeding script
```

> **Note:** The `CompanyInfo` module (company name, address, phone, about) was intentionally removed from the backend. This data is managed directly in the frontend code, since it changes rarely for a newly established company.

---

## Getting Started

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file inside `src/config/` (see [Environment Variables](#environment-variables) below).

### 3. Start MongoDB

Make sure MongoDB is running locally, or use a hosted instance (e.g. MongoDB Atlas) and update `MONGODB_URI` accordingly.

### 4. (Optional) Seed initial data

```bash
npm run seed
```

This creates an admin account, a few categories, and sample products. See [Seeding the Database](#seeding-the-database) for credentials.

### 5. Run the server

```bash
npm run dev     # development, with nodemon
npm start        # production
```

The API will be available at `http://localhost:4000`.

---

## Environment Variables

Create `src/config/.env` with the following keys:

```env
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/nasr

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
BEARER_KEY=Bearer

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

All of these are validated on startup in `env.config.js` — the app will refuse to start if any required variable is missing.

---

## Seeding the Database

```bash
npm run seed
```

**Warning:** this script deletes all existing users, categories, and products before inserting fresh data. Only run it in a development environment — never against production data.

The seed creates:
- One `admin` account
- Three categories: Legumes, Seeds, Other Crops
- Three sample products (White Beans, Fava Beans, Sesame Seeds)

**Default login credentials after seeding:**
```
email:    admin@elnasr.com
password: Admin@123
```

Change this password immediately after your first login.

---

## API Overview

| Module | Base Route | Access |
|---|---|---|
| Auth | `/api/auth` | `POST /register` open only for the very first account, admin-only afterwards |
| Categories | `/api/categories` | `GET` public, `POST`/`PUT`/`DELETE` protected (editor+) |
| Products | `/api/products` | `GET` public, `POST`/`PUT`/`DELETE`/`PATCH` protected (editor+) |
| Upload | `/api/upload` | fully protected (editor+) |
| Quote Requests | `/api/quote-requests` | `POST` public (rate-limited), rest protected (editor+) |
| Dashboard | `/api/dashboard/stats` | fully protected (editor+) |
| Health Check | `/api/health` | public |

### Key Endpoints

**Auth**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

**Categories**
```
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

**Products**
```
GET    /api/products              # supports ?page, ?size, ?category, ?status
GET    /api/products/:slug
POST   /api/products
PUT    /api/products/:id
PATCH  /api/products/:id/images   # attach uploaded images to a product
DELETE /api/products/:id
```

**Upload**
```
POST   /api/upload                # multipart/form-data, field name: images (max 5)
DELETE /api/upload/:public_id
```

**Quote Requests**
```
POST   /api/quote-requests        # public, rate-limited to 5 requests/hour per IP
GET    /api/quote-requests        # supports ?page, ?size, ?status
GET    /api/quote-requests/:id
PATCH  /api/quote-requests/:id
DELETE /api/quote-requests/:id
```

**Dashboard**
```
GET    /api/dashboard/stats       # products/categories/quote-requests counts
```

---

## Authentication Flow

1. `POST /api/auth/register` is open **only when the database has zero users** — the first person to register automatically becomes `admin` (handled by `bootstrapOrAdmin.middleware.js`).
2. After that first account exists, registering a new user requires a valid `admin` token.
3. `POST /api/auth/login` returns a JWT formatted as `Bearer <token>`.
4. Protected routes require the header:
   ```
   Authorization: Bearer <token>
   ```

---

## Roles & Permissions

| Role | Permissions |
|---|---|
| `admin` | Full access — can manage products, categories, quote requests, and register new users |
| `editor` | Can manage products, categories, and quote requests — cannot register new users |

---

## Bilingual Fields

Every user-facing text field on `Product` and `Category` is stored as a pair of `_en` / `_ar` fields inside the **same document** — there is no separate translation table:

```js
name_en: "White Beans",
name_ar: "فاصوليا بيضاء",
description_en: "...",
description_ar: "...",
```

The API always returns both languages in a single response. The frontend is responsible for choosing which field to display based on the currently active language (default: English).

---

## Product Status Flow

```
draft → in_review → published
```

- The **public website** only displays products with `status: "published"`.
- The **dashboard** can view and filter by any status.
- Quote requests can only be submitted for `published` products (enforced server-side in `quote-request.service.js`).

---

## Image Uploads

Images are handled independently from product creation:

1. Upload images via `POST /api/upload` (multipart, field `images`, max 5 files, 5MB each — JPEG/PNG/WEBP only). Returns an array of `{ url, public_id }`.
2. Attach the returned images to a product via `PATCH /api/products/:id/images`.

This keeps image upload failures from affecting the rest of the product data, and allows re-uploading or removing images independently.

To delete an image, call `DELETE /api/upload/:public_id` — remember to `encodeURIComponent()` the `public_id` on the frontend, since Cloudinary IDs contain `/`.

---

## Pagination

Pagination is built into the generic repository (`paginate()` in `database.repository.js`) and is **optional**:

- `GET /api/products` (no query params) → returns **all** products.
- `GET /api/products?page=1&size=12` → returns a paginated result with `docsCount`, `pages`, and `currentPage`.

`GET /api/quote-requests` defaults to `page=1&size=10` (always paginated) since quote request volume can grow quickly.

---

## Security

- **Helmet** — secure HTTP headers, including a Content-Security-Policy that allows images from `res.cloudinary.com`.
- **CORS** — restricted to a whitelist of allowed origins (`CLIENT_URL` + local dev URLs).
- **express-mongo-sanitize** — strips MongoDB operator injection attempts from request bodies.
- **xss** — sanitizes all string fields in incoming request bodies.
- **express-rate-limit** — a general limiter on all `/api` routes, plus a stricter limiter (5 requests/hour per IP) on the public quote-request form to prevent spam.
- **compression** — reduces response payload size for better performance under load.
- Passwords are hashed with **bcrypt** before being saved; the `password` field is excluded from queries by default (`select: false`).

---

## Notes & Decisions

- **CompanyInfo was removed from the backend** — company details (address, phone, about text) are hardcoded in the frontend, since this data is expected to change rarely for a newly established company. If this changes in the future, the module can be reintroduced without affecting the rest of the API.
- **`getProducts` returns all statuses by default** on the public route — this is intentional so the same endpoint can serve both the public site (`?status=published`) and the dashboard (no filter, or any specific status) without duplicating logic.
- **Slugs are generated only from the English name** (`name_en`) via `slugify.js`, since English is the default language and slugs are used for SEO-friendly URLs.
- **`CompanyInfo` aside, everything else in this API is designed to be driven entirely from the dashboard** — categories, products, images, and quote request status — so day-to-day content updates never require a code deployment.