# Free Cloudflare Pages + Cloudflare D1 Deployment Guide (with Hostinger Domain)

Your project now supports **Cloudflare Pages + Cloudflare D1 ($0/month free tier)** without changing any frontend UI code.

---

## Step 1: Connect Your Hostinger Domain to Cloudflare (Free)
1. Sign up for a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Click **Add a site** → enter your domain name → select the **Free** plan.
3. Cloudflare will display **2 Nameservers** (e.g., `ana.ns.cloudflare.com`, `bob.ns.cloudflare.com`).
4. Open your **Hostinger hPanel** → **Domains** → select your domain → **DNS / Nameservers** → **Change Nameservers**.
5. Paste the 2 Cloudflare nameservers and save (DNS propagation usually takes 5–30 minutes).

---

## Step 2: Create the Free Cloudflare D1 Database
Run these commands in your project folder (requires Node.js):

```bash
# 1. Login to Cloudflare
npx wrangler login

# 2. Create the free D1 database
npx wrangler d1 create 3communes-db
```

Copy the `database_id` printed by that command and paste it into `wrangler.toml`:
```toml
database_id = "YOUR_COPIED_DATABASE_ID"
```

Then initialize the tables:
```bash
# 3. Apply the SQL schema to your D1 database
npx wrangler d1 execute 3communes-db --remote --file=./cloudflare/schema.sql
```

---

## Step 3: Set Environment Variables & Deploy
1. In Cloudflare Dashboard → **Workers & Pages** → **3-communes-informatique** → **Settings** → **Environment variables**:
   * `JWT_SECRET`: a strong random string (used to sign session cookies)
   * `VITE_GOOGLE_MAPS_API_KEY`: your Google Cloud Maps API key (restrict HTTP referrers to `https://yourdomain.com/*` and `https://*.pages.dev/*` in Google Cloud Console)
2. Build & deploy directly from CLI (or connect your GitHub repo with build command `npm run build` and output directory `dist`):
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```
3. In Cloudflare Dashboard → **Workers & Pages** → **3-communes-informatique** → **Settings** → **Functions** → **D1 database bindings**, confirm Variable name `DB` is bound to `3communes-db`.

---

## Step 4: Attach Your Hostinger Custom Domain
1. In Cloudflare Dashboard → **Workers & Pages** → **3-communes-informatique** → **Custom domains**.
2. Click **Set up a custom domain** → enter `yourdomain.com` (and optionally `www.yourdomain.com`).
3. Cloudflare automatically configures the DNS records and free SSL/HTTPS certificate.
