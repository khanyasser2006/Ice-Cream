# 🍨 Ciné

A cinematic, scroll-driven site for a luxury French-Mediterranean ice creamery — two pinned, scroll-scrubbed frame sequences (a 298-frame hero and a 248-frame peach "how it's made" story), a flavor collection with a four-slot tasting flight, a four-city boutique locator, a client-side admin CMS, and a containerized production build.

![React](https://img.shields.io/badge/-React%2018-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/-GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)
![Lenis](https://img.shields.io/badge/-Lenis-000000?style=flat-square)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Playwright](https://img.shields.io/badge/-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

---

## 🧰 Technologies

- React 18
- Vite 6
- JavaScript
- Tailwind CSS v3
- GSAP (ScrollTrigger) + Lenis
- Web Crypto API (SHA-256 password hashing)
- canvas-confetti
- Docker + Nginx (multi-stage build)
- Playwright (UI audit scripts)

---

## ✨ Features

- **Two Scroll-Scrubbed Frame Sequences**: A 298-frame hero and a 248-frame peach sequence, each fetched in batches of 12, decoded with `createImageBitmap` (with an `Image` fallback), and painted by a `requestAnimationFrame` canvas loop with the pixel ratio capped at 2, pinned through GSAP ScrollTrigger.
- **Scroll-Synced "How It's Made"**: The peach sequence drives four process steps — Dawn Fruit Harvest, Slow Cold-Press & Citrus Simmer, 48-Hour Cold Cream Infusion, and Low-Air Velvet Churning — with the active step derived from scroll progress.
- **Flavor Collection & Detail Preview**: Six flavors across Signature and Seasonal collections, each with tasting notes, sweetness and tartness levels, origin, fruit percentage, calories, dairy source, and a pairing suggestion.
- **Four-Slot Tasting Flight**: A slide-out drawer for building a tasting flight of up to four flavors, with a running subtotal and a confetti celebration at checkout.
- **Boutique Locator**: Four boutiques — Paris, Tokyo, Milan, and New York — each showing its live local time via `Intl.DateTimeFormat` and time zones.
- **Member Accounts**: Registration and sign-in with SHA-256 hashed passwords, 24-hour sessions, and a five-attempt, fifteen-minute lockout.
- **Admin CMS**: A dashboard for editing site content, with drag-and-drop image uploads where anything over 400 KB is downscaled to a 1200px-maximum JPEG before it's saved.
- **Production Container**: A multi-stage Dockerfile (Node 20 Alpine build, Nginx Alpine runtime) with single-page-app fallback and gzip, plus a `docker-compose.yml`.
- **Hardened Dev Server**: Vite serves `X-Frame-Options`, `nosniff`, `Referrer-Policy`, and `Permissions-Policy` headers, refuses to serve `.env` and key files, and ships production builds without source maps.
- **Editorial Details**: Alternating marquees, a parallax photo gallery, an error boundary around the whole app, plus a `SeoHelmet` component, sitemap, `robots.txt`, and web manifest.
- **Written Design Spec**: A peach-and-tangerine dual palette, Playfair Display with Plus Jakarta Sans, a 4pt grid, and motion timings, all documented in `DESIGN.md`.

---

## 🪜 The Process

I started with two short product videos — an ice cream commercial and a peach commercial — and turned each into a frame sequence with an FFmpeg script that scales to 1280×720 and uses motion-compensated interpolation to synthesize smooth in-between frames. The hero sequence opens the site; the peach sequence carries the "how it's made" story further down.

Rather than build a separate component per scene, I built two canvas scrubbers on the same pattern: batch-fetch the frames, decode them off the main thread, and let GSAP pin the section and scrub through them. The peach scrubber also maps its scroll progress onto four process steps, so the copy changes in step with the fruit on screen.

On the content side, flavors, process steps, boutiques, and gallery photos live in a single data file that seeds the CMS, which persists to `localStorage`. Larger uploaded images are downscaled on a canvas before saving, since storage space is the first thing a browser-only CMS runs out of.

I wanted the finished site to be easy to run anywhere, so it ships with a multi-stage Docker build that compiles the app and serves it from Nginx. The accounts are the part I'd call a UI scaffold rather than real security: the auth helpers say so in their own header comment, and the admin whitelist is visible in the client bundle.

---

## 📚 What I Learned

- **Motion-Interpolated Frame Synthesis**: Used FFmpeg's `minterpolate` filter with motion-compensated, bidirectional estimation to generate smooth intermediate frames from short source clips.
- **Reusing One Scrubber Pattern Twice**: Built the hero and process canvases on the same fetch, decode, and paint approach, so the second sequence cost far less than the first.
- **Driving Content from Scroll Progress**: Derived the active process step from scroll position instead of timers or click handlers, so the copy can't drift out of sync with the imagery.
- **Planning for the Storage Quota**: Downscaled uploads over 400 KB to 1200px JPEGs before saving them as data URLs, because a `localStorage`-backed CMS has a few megabytes to work with, not unlimited space.
- **Multi-Stage Docker Builds**: Compiled in a Node image and shipped only the built files in an Nginx image, keeping the runtime container small.
- **Labeling Client-Side Auth Honestly**: Marked the admin whitelist and session logic as UI gating rather than security, so nobody mistakes the lockout and hashing for a real backend.

---

## 🔧 How Can It Be Improved?

- Add real, server-verified authentication. Registering with the whitelisted admin email automatically creates an admin account with no ownership check, and the session is read back from `localStorage`, so anyone who knows the public whitelist can grant themselves the role.
- Replace the single, unsalted SHA-256 pass with a slow, salted password hash (PBKDF2, bcrypt, or Argon2) once there's a backend to do it.
- Make the tasting-flight checkout actually do something. It fires confetti and an alert saying a concierge confirmation "has been dispatched," but nothing is sent or stored, so the message isn't true yet.
- Copy the security headers into the Nginx config. Vite sets them only for `dev` and `preview`, so the Docker image that would serve production currently sends gzip and the SPA fallback but none of those headers.
- Fix `scripts/test_ui.cjs`, which opens `localhost:3000` while the dev server, `docker-compose.yml`, and the other test script all use `5173`.
- Remove the one-off `scripts/update_*.cjs` files — they embed full copies of the Tailwind config, `FlavorCollection.jsx`, and the stylesheet, so re-running one would overwrite current code. Also clear out `scratch/`, which is excluded from Docker and the zip packager but not from git, and contains machine-specific output paths.
- Drop the unused `@gsap/react`, `clsx`, and `tailwind-merge` dependencies and the never-imported `CustomCursor` component, or wire them in.
- Tighten route matching in `App.jsx`: it uses loose `includes()` checks, so any hash containing "how" lands on How It's Made, including unrelated ones like `#/showcase`. A plain route table would be safer.
- Re-export the still images at higher quality — the signature bowl still shows visible banding and posterization in its background.
- Rename the `cine-glacier` service and container in `docker-compose.yml`, and make `create-zip.bat` stop hardcoding `d:\` paths.

---

## 🚀 Running the Project

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/cine-ice-cream.git
cd cine-ice-cream
```

---

### Step 2 — Install Dependencies

**Prerequisites:** Node.js 18+

```bash
npm install
```

---

### Step 3 — Run the Development Server

```bash
npm run dev
```

---

### Step 4 — Open the Application

```
http://127.0.0.1:5173
```

*(The dev server is bound to `127.0.0.1` in `vite.config.js`, so use that address rather than `localhost`.)*

---

### Optional — Run the Production Build in Docker

**Prerequisites:** Docker

```bash
docker compose up --build
```

The container serves the built site through Nginx on `http://localhost:5173`.

---

### Optional — Regenerate the Frame Sequences

**Prerequisites:** FFmpeg on your `PATH`, plus the two source videos placed in the project root with the filenames expected by the script.

```bash
node scripts/extract_all_assets.cjs
```

---

## 🎥 Video




https://github.com/user-attachments/assets/a4a4c487-e8c5-4938-a8dc-a4f06afcdf2b




---
