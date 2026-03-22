# Veranda — Application Specification

**Version:** 1.0  
**Last Updated:** 2026-03-21  

---

## 1. Project Overview

A multilingual personal website built with Astro, served as a static site via Nginx inside a Docker container. Content is managed by manually uploading Markdown files and media assets to the codebase. The site supports three languages (Indonesian, English, Japanese) with fully manual translations — no auto-translation.

---

## 2. Goals & Non-Goals

### Goals
- Fast, SEO-optimized static site
- Manual content management via `.md` files and media uploads
- Multilingual support: `id`, `en`, `ja`
- Modular and extensible (future apps can be added behind the same gateway)
- Runs fully inside Docker

### Non-Goals
- CMS admin panel or web-based content editor
- Auto-translation
- Real-time dynamic features (except contact form, handled by a separate service)
- User authentication

---

## 3. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Astro 4.x | Static-first, native MD support, i18n routing, excellent SEO |
| Styling | Tailwind CSS 3.x | Utility-first, fast, consistent |
| Language | TypeScript | Type safety for content schemas and utils |
| Markdown | Astro Content Collections | Structured, typed, folder-based blog management |
| Image Optimization | `@astrojs/image` / Astro built-in | Auto compress/resize at build time |
| Icons | `astro-icon` + Iconify | Lightweight, SVG-based |
| Containerization | Docker + Nginx | Static file serving, production-grade |
| Build trigger | Manual or GitHub Actions | Push to repo → rebuild + redeploy |

---

## 4. Supported Languages

| Code | Language | URL Prefix |
|---|---|---|
| `id` | Indonesian | `/id/...` |
| `en` | English | `/en/...` |
| `ja` | Japanese | `/ja/...` |

- Default language (root `/`) redirects to `/id/` (configurable)
- If a page or blog post translation does not exist for a given language, display a clearly styled **"Content not available in this language"** notice with a link to an available version
- Language switcher is present on every page

---

## 5. Site Structure & Pages

### 5.1 URL Map

```
/                          → redirect to /{defaultLang}/
/{lang}/                   → Lobby (Home)
/{lang}/blog/              → Blog list
/{lang}/blog/{slug}/       → Blog post
/{lang}/projects/          → Project portfolio list
/{lang}/gallery/           → Photo gallery
/{lang}/contact/           → Contact form
```

### 5.2 Page Descriptions

#### Lobby (`/{lang}/`)
- Hero section with name, tagline (per language)
- Links to external websites (configurable list in a data file)
- Navigation links to internal pages
- Language switcher

#### Blog List (`/{lang}/blog/`)
- Lists all blog posts available in the current language
- Each card shows: title, date, tags, short excerpt
- Posts missing a translation for the current language are **not shown** in the list (they simply don't appear)
- Pagination (configurable page size, default 10)
- Tag filtering

#### Blog Post (`/{lang}/blog/{slug}/`)
- Rendered from `src/content/blog/{slug}/{lang}.md`
- If the `.md` file for that language does not exist: show a "not available" page with links to available language versions of the same post
- Displays: title, date, tags, reading time estimate, body content
- Code syntax highlighting (Shiki)
- Open Graph / Twitter Card meta tags auto-generated from frontmatter
- Structured data (JSON-LD Article schema) for SEO
- Should be able display medias (images, videos, etc.) that are referenced in the .md files

#### Project Portfolio (`/{lang}/projects/`)
- List of projects rendered from `src/content/projects/`
- Each project card: title, short description, tags/stack, thumbnail, link (external or internal)
- Filterable by tag
- Same translation fallback rule as blog

#### Gallery (`/{lang}/gallery/`)
- Photo grid rendered from images in `public/media/gallery/`
- Images are discovered at build time via a glob import
- Lightbox on click (CSS/JS, no heavy library required)
- Astro's built-in image optimization applied to all gallery images
- Optional: albums/folders for grouping (configurable)

#### Contact (`/{lang}/contact/`)
- Simple form: Name, Email, Subject, Message
- Hidden honeypot field (spam protection, client-side)
- hCaptcha widget (spam protection, requires hCaptcha site key configured via env)
- On submit: POST to the external contact-service API (`/api/contact`)
- Success/error state displayed inline (no page reload)
- Form labels and placeholder text are localized per language

---

## 6. Content Management

### 6.1 Directory Structure

```
/
├── src/
│   ├── content/
│   │   ├── blog/
│   │   │   ├── post-slug/
│   │   │   │   ├── en.md
│   │   │   │   ├── id.md
│   │   │   │   └── ja.md
│   │   └── projects/
│   ├── pages/
│   │   ├── [lang]/
│   │   │   ├── index.astro       ← lobby
│   │   │   ├── blog/
│   │   │   ├── projects/
│   │   │   ├── gallery/
│   │   │   └── contact/
├── public/
│   └── media/                    ← you manually drop images here
└── docker-compose.yml
```

### 6.2 Blog Post Frontmatter Schema

Each `{lang}.md` file must include:

```yaml
---
title: "Post Title"
date: 2026-03-21
description: "Short excerpt shown in list view (max 160 chars)"
tags: ["tag1", "tag2"]
coverImage: "/media/blog/{slug}/cover.jpg" 
---
```

### 6.3 Project Frontmatter Schema

```yaml
---
title: "Project Name"
date: 2025-01-01
description: "Short description"
tags: ["React", "Docker"]
thumbnail: "/media/projects/{slug}/thumb.jpg"
externalUrl: "https://github.com/..."
---
```

### 6.4 Adding New Content (Workflow)

**New blog post:**
1. Create folder `src/content/blog/{slug}/`
2. Add at minimum one `{lang}.md` with valid frontmatter
3. Drop any related images into `public/media/blog/{slug}/`
4. Commit and push → triggers rebuild and redeploy

**New gallery photo:**
1. Drop image into `public/media/gallery/{album}/`
2. Commit and push → gallery auto-discovers new images at build time

---

## 7. Internationalization (i18n)

### 7.1 Routing Strategy

- All pages live under `/{lang}/` prefix
- Astro's built-in i18n routing (`astro.config.mjs → i18n`) handles this
- `defaultLocale: 'en'`
- Root `/` → 302 redirect to `/en/`

### 7.2 UI String Translations

Non-content UI strings (nav labels, button text, error messages, form labels) are stored in:

```
src/i18n/
├── en.ts
├── id.ts
└── ja.ts
```

Each file exports a flat key-value object. A `useTranslations(lang)` helper is used in all `.astro` components.

### 7.3 Translation Fallback

| Scenario | Behavior |
|---|---|
| Blog post has no `{lang}.md` | Post hidden from that language's list page |
| User navigates directly to missing URL | "Not available" page shown with links to existing versions |
| Project missing translation | Same as blog |
| UI string missing | Falls back to English key (dev warning logged) |

---

## 8. SEO Requirements

| Feature | Implementation |
|---|---|
| `<title>` and `<meta description>` | Per-page, from frontmatter or page config |
| Open Graph tags | Auto-generated on all pages |
| Twitter Card | Auto-generated |
| Canonical URLs | Always set, including language variants |
| `hreflang` tags | All language variants linked on every page |
| Sitemap | `@astrojs/sitemap` — auto-generated, all langs |
| Robots.txt | Static file in `public/` |
| JSON-LD structured data | Article schema on blog posts; Person schema on lobby |
| Semantic HTML | All pages use proper heading hierarchy, `<main>`, `<nav>`, `<article>`, etc. |
| Image alt text | Required field in gallery metadata; frontmatter for blog covers |
| Core Web Vitals | Static output + image optimization ensures good LCP/CLS by default |

---

## 9. Design & UI Guidelines

### 9.1 Aesthetic Direction

- **Tone:** Editorial / refined minimal — clean typographic hierarchy, generous whitespace, subtle texture
- **Typography:** Pair a distinctive serif or semi-display font for headings with a highly legible body font. Avoid generic system fonts.
- **Color:** Defined via CSS custom properties. A dominant neutral base with one sharp accent color. Support both light and dark mode (CSS `prefers-color-scheme` + manual toggle).
- **Motion:** Subtle page load stagger, hover states on cards/links. No heavy JS animation libraries.
- **Layout:** Responsive, mobile-first. Max content width ~720px for reading, wider for gallery grid.

### 9.2 Component Inventory

| Component | Notes |
|---|---|
| `BaseLayout.astro` | Common `<head>`, nav, footer, language switcher |
| `BlogCard.astro` | Used in blog list |
| `ProjectCard.astro` | Used in project list |
| `GalleryGrid.astro` | Photo grid with lightbox |
| `LanguageSwitcher.astro` | Dropdown or pill toggle, shows current lang |
| `TranslationNotice.astro` | "Not available" notice with alternate lang links |
| `ContactForm.astro` | Form with hCaptcha integration |
| `SEOHead.astro` | All meta, OG, JSON-LD tags |
| `ThemeToggle.astro` | Light/dark mode toggle |

---

## 10. Environment Variables

Stored in `.env` (not committed to git). Required at build time or runtime:

```env
PUBLIC_SITE_URL=yourdomain.com
PUBLIC_DEFAULT_LANG=en
PUBLIC_HCAPTCHA_SITE_KEY=...
CONTACT_API_URL=contact-service:3000   # internal Docker network URL
PUBLIC_UMAMI_SCRIPT_URL=yourdomain.com/umami/script.js
PUBLIC_UMAMI_WEBSITE_ID=...
```

---

## 11. Analytics Integration

- **Umami** script injected in `BaseLayout.astro` via env vars
- Script is loaded with `defer` and only when `PUBLIC_UMAMI_WEBSITE_ID` is set
- Tracks: page views, outbound link clicks, contact form submission events (custom events)
- No cookies, GDPR-friendly by default

---

## 12. Docker & Build

### 12.1 Build Process

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build        # outputs to /app/dist

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 12.2 Nginx Config (inside container)

- Serves `/usr/share/nginx/html` as static root
- `try_files $uri $uri/ /404.html` for SPA-like 404 handling
- Gzip compression enabled
- Cache-control headers for assets (`/media/`, `/_astro/`)
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`

### 12.3 Docker Compose Service Definition

```yaml
veranda:
  build:
    context: ./veranda
    dockerfile: Dockerfile
  restart: unless-stopped
  networks:
    - internal
  environment:
    - NODE_ENV=production
  # No ports exposed directly — Nginx gateway handles routing
```

---

## 13. Accessibility

- All images have `alt` attributes (enforced by content schema)
- Keyboard-navigable language switcher and nav
- ARIA labels on icon-only buttons
- Focus-visible styles on all interactive elements
- Color contrast ratio ≥ 4.5:1 for body text

---

## 14. Out of Scope (This Spec)

- Contact service (separate spec)
- Analytics service / Umami (separate spec)
- Nginx gateway / Docker Compose full stack (separate spec)
- CI/CD pipeline (separate spec)
- Azure deployment runbook (separate spec)