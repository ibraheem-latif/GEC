# SoLa - Vercel Deployment Guide

Complete step-by-step guide to deploy your Glasgow chauffeur website to Vercel with working contact form.

---

## Prerequisites

- [x] GitHub account (free)
- [x] Vercel account (free - sign up at vercel.com)
- [x] Resend account (free - sign up at resend.com)
- [x] Domain name (optional - can use free .vercel.app domain first)

**Total cost:** £0/month (or £10/year if you buy soulco.co.uk domain)

---

## Part 1: Set Up Email Service (5 minutes)

### Step 1: Create Resend Account

1. Go to **https://resend.com**
2. Click "Sign Up" → Sign up with GitHub (easiest)
3. Verify your email address

### Step 2: Get API Key

1. After login, go to **https://resend.com/api-keys**
2. Click "Create API Key"
3. Name it: `Soul Co Website`
4. Permission: `Sending access`
5. Click "Add"
6. **COPY THE API KEY** (starts with `re_...`)
   - ⚠️ Save this somewhere safe - you can only see it once!

### Step 3: Add Sending Domain (Optional but Recommended)

**Option A: Use your domain (soulco.co.uk)**
1. Go to **Domains** in Resend
2. Click "Add Domain"
3. Enter: `soulco.co.uk`
4. Add the DNS records they give you to your domain provider
5. Wait for verification (usually 5-10 minutes)

**Option B: Use Resend's test domain (for now)**
- You can send from `onboarding@resend.dev`
- Limited to 100 emails/day
- Works fine for testing

---

## Part 2: Push Code to GitHub (3 minutes)

### Step 1: Initialize Git Repository

```bash
cd urbansoul-travel
git init
git add .
git commit -m "Initial commit - Soul Co website"
```

### Step 2: Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `sola-website`
3. Description: `SoLa Glasgow Chauffeur Service Website`
4. Privacy: **Private** (recommended) or Public
5. Click "Create repository"

### Step 3: Push Code

Copy the commands GitHub shows you:

```bash
git remote add origin https://github.com/YOUR-USERNAME/sola-website.git
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy to Vercel (5 minutes)

### Step 1: Connect Vercel to GitHub

1. Go to **https://vercel.com**
2. Click "Sign Up" → Sign up with GitHub
3. Authorize Vercel to access your GitHub

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Find `sola-website` in the list
3. Click "Import"

### Step 3: Configure Project

**Framework Preset:** Vite (auto-detected)
**Root Directory:** `./` (leave as is)
**Build Command:** `npm run build` (auto-filled)
**Output Directory:** `dist` (auto-filled)

### Step 4: Add Environment Variables

**IMPORTANT:** Before clicking "Deploy", add these:

1. Click "Environment Variables" (expand section)
2. Add variable 1:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Paste your Resend API key (re_...)
   - Environment: All (Production, Preview, Development)
3. Add variable 2:
   - **Key:** `TO_EMAIL`
   - **Value:** `bookings@soulco.co.uk` (or your email)
   - Environment: All

### Step 5: Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes
3. When you see confetti 🎉 - it's live!

### Step 6: Test Your Site

1. Click "Visit" or copy the URL
2. Your site is live at: `https://sola-website.vercel.app`
3. Test the contact form by filling it in
4. Check your email - you should receive the booking request!

---

## Part 4: Add Custom Domain (Optional - 10 minutes)

### If you have solachauffeur.co.uk:

1. In Vercel, go to your project
2. Click "Settings" → "Domains"
3. Add domain: `solachauffeur.co.uk`
4. Add www subdomain: `www.solachauffeur.co.uk`
5. Vercel will give you DNS records to add

### Update DNS at your domain provider:

**For solachauffeur.co.uk:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.solachauffeur.co.uk:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait 10-60 minutes for DNS propagation**

---

## Part 5: Update Contact Form Email

### Update the "from" email in API

Edit `api/contact.js` line 33:

```javascript
from: 'SoLa Chauffeur <bookings@solachauffeur.co.uk>',
```

**Change to match your verified Resend domain:**
- If using your domain: `SoLa Chauffeur <bookings@solachauffeur.co.uk>`
- If using Resend test: `SoLa Chauffeur <onboarding@resend.dev>`

Then push changes:

```bash
git add .
git commit -m "Update sender email"
git push
```

Vercel will auto-deploy in 30 seconds!

---

## Testing Checklist

### ✅ Before Going Live

- [ ] Fill out contact form on your site
- [ ] Check email arrives at bookings@solachauffeur.co.uk
- [ ] Test on mobile phone
- [ ] Check all links work
- [ ] Replace placeholder images with actual Lexus photos
- [ ] Update phone number (currently shows 0141 XXX XXXX)
- [ ] Update service descriptions if needed
- [ ] Test on different browsers (Chrome, Safari, Firefox)

---

## Ongoing Maintenance

### How to Make Changes

1. Edit files locally
2. Test: `npm run dev`
3. Commit: `git add . && git commit -m "description"`
4. Push: `git push`
5. Vercel auto-deploys in ~30 seconds!

### Monitor Contact Form

- Check Resend dashboard: https://resend.com/emails
- See delivery status, opens, etc.
- Free tier: 100 emails/day (plenty for a chauffeur service)

### Costs

- **Vercel:** FREE forever for this site
- **Resend:** FREE up to 3,000 emails/month
- **Domain:** ~£10/year (Namecheap, 123-reg, etc.)
- **Total:** ~£10/year

---

## Troubleshooting

### Contact form not working?

1. Check Vercel logs:
   - Go to project → Deployments → Click latest → Functions tab
   - Look for /api/contact errors

2. Check environment variables:
   - Settings → Environment Variables
   - Make sure `RESEND_API_KEY` and `TO_EMAIL` are set

3. Check Resend dashboard:
   - https://resend.com/emails
   - See if emails are being sent

### DNS not working?

- Wait 30-60 minutes for propagation
- Check DNS with: https://dnschecker.org
- Make sure you added the right records

### Site not updating?

- Check Vercel deployments tab
- Make sure git push went through
- Clear browser cache (Cmd/Ctrl + Shift + R)

---

## Next Steps

### 1. Replace Images

Put your actual Lexus ES300h photos in `/public/images/`:

```
public/
  images/
    lexus-main.jpg
    lexus-interior.jpg
    lexus-airport.jpg
    lexus-tour.jpg
```

Then update image paths in:
- `src/components/About.jsx` (line 10)
- `src/components/Services.jsx` (lines 8, 15, 22)

### 2. Add Google Analytics (Optional)

1. Get tracking ID from Google Analytics
2. Add to `index.html` before `</head>`

### 3. Add Facebook Pixel (Optional)

For tracking Facebook ad conversions

### 4. Set Up Google Business Profile

Free listing on Google Maps - huge for local SEO!

---

## Support

**Vercel Docs:** https://vercel.com/docs
**Resend Docs:** https://resend.com/docs

**Need help?**
- Vercel has free chat support
- Resend has Discord community

---

**Your site is ready to take bookings for SoLa!** 🚗✨
