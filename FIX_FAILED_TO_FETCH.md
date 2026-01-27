# 🚀 QUICK FIX: Add Environment Variables to Vercel

## ⚡ Fastest Solution (2 minutes)

### Step 1: Open Vercel Dashboard
Click this link: https://vercel.com/aaditya29112005s-projects/smart-par-k019/settings/environment-variables

### Step 2: Add Variable 1
- Click **"Add New"**
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://wzimrvfzmelgfcmuqqtw.supabase.co`
- Select: ✅ Production ✅ Preview ✅ Development
- Click **"Save"**

### Step 3: Add Variable 2
- Click **"Add New"** again
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aW1ydmZ6bWVsZ2ZjbXVxcXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjIzMTQsImV4cCI6MjA4NTA5ODMxNH0.-NIRkjr1wbOoXoIJU1XEajO5vtj5Nzj7JmhWTPVqBWE`
- Select: ✅ Production ✅ Preview ✅ Development
- Click **"Save"**

### Step 4: Redeploy
- Go to: https://vercel.com/aaditya29112005s-projects/smart-par-k019/deployments
- Click the **⋯** (three dots) on the latest deployment
- Click **"Redeploy"**
- Wait 2 minutes

### ✅ Done!
Visit https://smart-par-k019.vercel.app - No more "Failed to fetch" error!

---

## 🖥️ Alternative: Use Automated Script

Run this command in your terminal:
```bash
cd /Users/aadityamohansamadhiya/Downloads/pixel-park-deploy-main
./setup-vercel-env.sh
```

This will:
1. Install Vercel CLI
2. Login to Vercel
3. Add all environment variables
4. Trigger a redeploy

---

## 🎯 What This Fixes

- ✅ Removes "Failed to fetch" error
- ✅ Enables Supabase authentication
- ✅ Allows real database connections
- ✅ Makes signup/login work

---

## 📝 Quick Reference

**Vercel Project**: https://vercel.com/aaditya29112005s-projects/smart-par-k019
**Settings**: https://vercel.com/aaditya29112005s-projects/smart-par-k019/settings/environment-variables
**Deployments**: https://vercel.com/aaditya29112005s-projects/smart-par-k019/deployments
