# Eshetu Melese Member Portal, Membership Card Studio & CMS

High-performance, mobile-first membership platform & zero-code CMS engineered for the **Eshetu Melese Community** (scaling to 3.2M+ subscribers). 

Includes automated digital membership card rendering, visual drag-and-drop Card Studio, dynamic Section & Theme Builder, strict API RBAC matrix, Notion sync, and self-hosted GitHub deployment.

---

## 🌟 Features Overview

1. **Zero-Code Public Website CMS**:
   - Every headline, paragraph, CTA, FAQ, perk, and pricing is CMS-driven.
   - Live section re-ordering with drag-and-drop hierarchy.
2. **International Registration System**:
   - Built-in country dial selector (200+ countries, defaulting to 🇪🇹 Ethiopia `+251`).
   - Normalizes numbers into E.164 standard (`+251911234567`) for fast search & duplicate prevention.
   - Payment receipt upload (Telebirr, CBE Birr, Awash Bank, International Transfer).
3. **Visual Card Editing Studio**:
   - Aspect ratio preset control (CR80 ID card `85.60:53.98`, 16:9, 3:2, 4:3, 1:1, 9:16).
   - Custom card artwork base uploader (PNG, JPG, SVG).
   - Draggable & configurable dynamic member fields (Name, ID, Photo avatar, QR code, Tier badge, Dates, Custom text).
4. **Member Verification & Pass Search**:
   - Public search by phone number, Member ID, or full name.
   - High-resolution cryptographic badge downloads (PNG / WebP).
   - 1-click social sharing to Telegram, WhatsApp, and Facebook.
5. **Strict Role-Based Access Control (RBAC)**:
   - **Admin**: Full access (Approvals, Rejections, Pricing, Card Design, CMS, User roles).
   - **Editor**: Can update CMS content, reorder sections, and adjust pricing; **strictly forbidden** at API-level from approving/rejecting members.
   - **Viewer**: Read-only dashboard and preview access.
6. **Notion & Disaster Recovery**:
   - Direct database property sync with Notion.
   - Soft-delete pattern (`is_deleted = true`) and comprehensive audit logs for all administrative actions.

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- Node.js 18+ or 20+
- PostgreSQL or Docker

### 2. Installation
```bash
# Clone repository
git clone https://github.com/your-username/eshetu-melese-portal.git
cd eshetu-melese-portal

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### 3. Database Setup & Seed
```bash
# Push schema migrations
npx prisma db push

# Seed initial tiers, default CMS sections, themes, and admin accounts
npm run prisma:seed # or npx ts-node prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@eshetumelese.com` | `AdminPassword2026!` |
| **Editor** | `editor@eshetumelese.com` | `EditorPassword2026!` |
| **Viewer** | `viewer@eshetumelese.com` | `ViewerPassword2026!` |

---

## 🐳 Docker Production Deployment

To deploy on your own server or VPS using Docker:

```bash
docker-compose up -d --build
```
This automatically starts:
- PostgreSQL 16 container with persistent volumes
- Next.js application container on port 3000

---

## 🛡️ API Endpoints Summary

- `POST /api/auth/login` — Staff & admin authentication
- `POST /api/members/register` — Public registration with receipt upload
- `GET /api/members/search` — Public verified member and badge lookup
- `GET /api/admin/members` — Admin member management table
- `POST /api/admin/members/:id/approve` — Strict Admin-only approval & badge generation
- `POST /api/admin/members/:id/reject` — Strict Admin-only rejection with reason
- `PUT /api/cms/sections` — Drag-and-drop section reordering
- `POST /api/admin/card-templates` — Save visual Card Studio layout
- `POST /api/admin/notion` — Trigger Notion synchronization
