# 🔗 Linkvault — Backend API

> **Linkvault** is a personal, searchable bookmark vault. This is the **backend** repository — a Node.js + Express REST API backed by MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)](https://jwt.io/)

---

## ✨ Features

- **JWT Authentication** — Stateless tokens with 7-day expiry; validated on every protected route
- **bcrypt passwords** — 10 salt rounds; plain-text passwords are never stored
- **MongoDB / Mongoose** — Flexible schema with compound unique indexes
- **Tag System** — Per-user tag library; many-to-many bookmarks ↔ tags via array refs
- **Bookmark counts per tag** — Aggregation pipeline returns live counts
- **Cascading tag delete** — Deleting a tag removes it from all bookmarks automatically
- **Bulk tag creation** — Single endpoint for profile-setup starter tags
- **Input validation** — `express-validator` on all write endpoints
- **CORS configured** — Allows only the configured `CLIENT_URL`

---

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js        # name, email, password_hash, avatar, display_name
│   │   ├── Bookmark.js    # url, title, description, favicon_url, tags[]
│   │   └── Tag.js         # name, user_id — unique(user_id, name)
│   ├── routes/
│   │   ├── auth.js        # POST /register, POST /login
│   │   ├── users.js       # GET/PUT /profile
│   │   ├── bookmarks.js   # GET/POST/DELETE /bookmarks
│   │   └── tags.js        # GET/POST/POST bulk/DELETE /tags
│   ├── middleware/
│   │   └── auth.js        # JWT verification → req.user
│   └── server.js          # Express app, MongoDB connect, route mounting
├── .env                   # Environment variables (not committed)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI

### Install & Run

```bash
npm install

# Copy and edit environment variables
cp .env.example .env

npm start
```

Server runs at **http://localhost:5000**

For development with auto-restart:
```bash
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/linkvault
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server listens on |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret for signing/verifying JWT tokens |
| `CLIENT_URL` | Allowed CORS origin (your frontend URL) |

---

## 📡 API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Register a new user → returns `{ token, user }` |
| `POST` | `/api/auth/login` | — | Login → returns `{ token, user }` |

**Register body:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

---

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/profile` | ✅ | Get the authenticated user's profile |
| `PUT` | `/api/users/profile` | ✅ | Update `display_name`, `avatar`, `profile_setup_done` |

**PUT body (any combination):**
```json
{ "display_name": "Jane", "avatar": "🚀", "profile_setup_done": true }
```

---

### Bookmarks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookmarks` | ✅ | Get all bookmarks (incl. populated tags), newest first |
| `POST` | `/api/bookmarks` | ✅ | Create a bookmark |
| `DELETE` | `/api/bookmarks/:id` | ✅ | Delete a bookmark by ID |

**POST body:**
```json
{
  "url": "https://example.com",
  "title": "Example Site",
  "description": "Optional note",
  "tag_ids": ["<tag_id_1>", "<tag_id_2>"]
}
```

**Favicon** is automatically computed from the URL's hostname using:
```
https://www.google.com/s2/favicons?domain=<hostname>&sz=64
```

---

### Tags

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tags` | ✅ | Get all tags with live bookmark counts |
| `POST` | `/api/tags` | ✅ | Create a single tag |
| `POST` | `/api/tags/bulk` | ✅ | Create multiple tags (profile setup) |
| `DELETE` | `/api/tags/:id` | ✅ | Delete tag + remove from all bookmarks |

**POST /tags body:**
```json
{ "name": "Work" }
```

**POST /tags/bulk body:**
```json
{ "names": ["Work", "Research", "Design"] }
```

---

## 🗄️ Database Schema

### `users`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Auto |
| `name` | String | Required |
| `email` | String | Required · Unique |
| `password_hash` | String | bcrypt 10 rounds |
| `display_name` | String | Nullable |
| `avatar` | String | Default `🦊` |
| `profile_setup_done` | Boolean | Default `false` |

### `bookmarks`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Auto |
| `user_id` | ObjectId | Ref → User |
| `url` | String | Required |
| `title` | String | Required |
| `description` | String | Nullable |
| `favicon_url` | String | Auto-computed |
| `tags` | [ObjectId] | Ref → Tag |
| `created_at` | Date | Auto |

### `tags`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Auto |
| `user_id` | ObjectId | Ref → User |
| `name` | String | Required |
| Unique index | `(user_id, name)` | No duplicate tags per user |

---

## 🔗 Related Repositories

- **Frontend**: [link-vault-front](https://github.com/hiravpatel/link-vault-front) — React PWA

---

## 📄 License

MIT
