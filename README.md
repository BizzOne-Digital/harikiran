# TopAdvice4U Financial Services Inc.

Production-ready premium financial services website and admin CMS built with Next.js 16, MongoDB, and Better Auth.

## Logo placement

Place your logo files here:

```
public/logo/logo.svg          # Primary logo (recommended)
public/logo/logo.png          # PNG alternative
public/logo/logo-light.svg    # Optional light variant
public/logo/favicon.ico       # Optional favicon
```

The site uses `/logo/logo.svg` by default. You can also upload a logo through **Admin → Settings → Branding**.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 (CSS-first theme)
- MongoDB Atlas + Mongoose 9
- Better Auth (email/password admin)
- Motion + GSAP animations
- Cloudinary media (optional; local fallback in dev)
- Resend email (optional; forms still save without it)

## Prerequisites

- Node.js 20.9+
- MongoDB Atlas cluster (or local MongoDB)
- Environment variables (see `.env.example`)

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required:

- `MONGODB_URI` — MongoDB connection string
- `BETTER_AUTH_SECRET` — min 32 characters
- `BETTER_AUTH_URL` — e.g. `http://localhost:3000`
- `NEXT_PUBLIC_SITE_URL` — e.g. `http://localhost:3000`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` — for seed script

3. **Seed the database**

```bash
npm run seed
```

This creates the Super Admin, site settings, 8 services, pages, FAQs, navigation, and form definitions. It does **not** seed fake testimonials or team members.

4. **Run development server**

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (calculator utilities) |
| `npm run seed` | Seed MongoDB with initial content |

## Admin portal

Routes:

- `/admin` — Dashboard
- `/admin/services`, `/admin/offerings`, `/admin/blog`, `/admin/team`, `/admin/faqs`
- `/admin/leads` — Lead management with CSV export
- `/admin/media` — Media library
- `/admin/settings` — Branding, contact, SEO, integrations
- `/admin/users` — User roles (Super Admin only)

Roles: `super_admin`, `admin`, `editor`, `lead_manager`

## Deployment (Vercel)

1. Push to GitHub and import in Vercel
2. Add all environment variables from `.env.example`
3. Run seed script once against production MongoDB
4. Upload logo via admin or commit to `public/logo/`

## Contact defaults (seeded)

- **Business:** TopAdvice4U Financial Services Inc.
- **Contact:** Harkiran Panesar
- **Email:** topadvice4you@gmail.com
- **Phone:** +1 604-837-3797
- **Domain:** topadvice4u.com

## Disclaimer

Website content and calculators are educational estimates only. Final terms depend on providers, underwriting, and individual circumstances.
