# SoLa - Quick Deploy Guide

## 🚀 Deploy in 15 Minutes

### Step 1: Get Resend API Key (3 min)
1. Sign up: https://resend.com
2. Get API key: https://resend.com/api-keys
3. Save the key (starts with `re_...`)

### Step 2: Push to GitHub (3 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/sola-website.git
git push -u origin main
```

### Step 3: Deploy to Vercel (5 min)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import `sola-website`
4. Add Environment Variables:
   - `RESEND_API_KEY` = your Resend key
   - `TO_EMAIL` = bookings@solachauffeur.co.uk
5. Click "Deploy"

### Step 4: Test (2 min)
1. Visit your live site
2. Fill out contact form
3. Check your email!

---

## 📋 Before Going Live Checklist

- [ ] Test contact form
- [ ] Replace placeholder images with actual Lexus photos
- [ ] Update phone number (currently 0141 XXX XXXX)
- [ ] Test on mobile
- [ ] Add custom domain (optional)

---

## 📁 Project Structure

```
urbansoul-travel/
├── api/
│   └── contact.js           # Serverless function for contact form
├── src/
│   ├── components/          # React components
│   └── index.css            # Tailwind styles
├── public/                  # Static files (add your images here)
├── vercel.json              # Vercel configuration
├── .env.example             # Environment variables template
└── DEPLOYMENT.md            # Full deployment guide
```

---

## 💰 Total Cost

- Vercel: **FREE**
- Resend: **FREE** (100 emails/day)
- Domain: **£10/year** (optional)

**Total: £0-10/year**

---

## 🆘 Need Help?

Read the full guide: **DEPLOYMENT.md**

Common issues:
- Contact form not working? Check environment variables in Vercel
- Site not updating? Push to GitHub triggers auto-deploy
- Images not showing? Put them in `/public/images/`
