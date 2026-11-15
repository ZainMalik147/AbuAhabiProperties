# Abu Dhabi Properties — Property Developer Guide

An independent editorial directory showcasing established property developers contributing to Abu Dhabi's evolving residential landscape (Aldar, Modon, Bloom Holding, Reportage Group).

**Design Style:** Modern Architectural Luxury — Obsidian, champagne gold, Islamic geometry star motif, Italiana & Jost fonts, 3D gold wireframe skyline scene.

---

## ?? Quick Start: Push to GitHub

To upload this folder to your GitHub account as its own standalone repository:

1. **Create an empty repository on GitHub**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Name it bu-dhabi-properties (or whatever you prefer).
   - Do **NOT** initialize with a README, .gitignore, or license (they are already included here).

2. **Run these commands in this folder**:
   `ash
   git init -b main
   git add .
   git commit -m "Initial commit: Abu Dhabi Properties editorial guide"
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/abu-dhabi-properties.git
   git push -u origin main
   `

---

## ?? Publish Live for Client Demo (Under 60 Seconds)

### Option A: Netlify (Recommended for Client Demos)
Netlify provides a free, instant HTTPS URL with zero configuration:
1. Go to [app.netlify.com](https://app.netlify.com/) and click **"Add new site" ? "Import an existing project"**.
2. Connect your GitHub account and select your bu-dhabi-properties repository.
3. Netlify will automatically detect settings from 
etlify.toml:
   - **Publish directory:** dist
   - **Build command:** 
ode build.mjs
4. Click **Deploy**. Your site will be live immediately at https://abu-dhabi-properties-xxxx.netlify.app.
   *(You can change the site name to e.g. bu-dhabi-properties-demo.netlify.app in Site Settings).*

### Option B: Vercel
1. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
2. Select your bu-dhabi-properties repo.
3. Vercel automatically uses ercel.json (dist output). Click **Deploy**.

### Option C: GitHub Pages (Automated Workflow)
A pre-configured GitHub Actions workflow is included in .github/workflows/deploy.yml:
1. On GitHub, go to your repository **Settings** ? **Pages**.
2. Under **Build and deployment ? Source**, select **GitHub Actions**.
3. The workflow will automatically build and publish the site to your GitHub Pages URL!

---

## ?? Repository Structure

`
+-- content/           # Content JSON files:
¦   +-- site.json      # Site settings, metadata, copy & hero text
¦   +-- developers.json# Profiles, images, stats & projects
+-- assets/            # Static media:
¦   +-- brand/         # Favicon, icons
¦   +-- img/           # WebP photos (960w & 1920w)
¦   +-- logos/         # Developer brand logos
+-- theme/             # Design & layouts:
¦   +-- templates.mjs  # Page templates (Home, Profiles, Legal, 404)
¦   +-- static/        # CSS styles, main.js interaction, 3D skyline scene.js
+-- admin/             # Decap CMS configuration (/admin)
+-- _core/             # Generator core (legal pages, SEO sitemaps, analytics)
+-- dist/              # Pre-compiled static website (ready to serve/publish)
+-- build.mjs          # Standalone build script
+-- serve.mjs          # Local static preview server
+-- netlify.toml       # Netlify configuration
+-- vercel.json        # Vercel configuration
`

---

## ??? Local Development & Build

Requires Node 18+:

`ash
# Build the site into ./dist
node build.mjs

# Preview locally with clean URLs at http://localhost:3000
node serve.mjs 3000
`

---

## ?? Decap CMS (/admin)

Visit /admin on your live deployed site to manage developers, copy, and images via Decap CMS.
- Edits save directly to your GitHub repository and automatically trigger a live rebuild.
