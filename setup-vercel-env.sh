#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you add environment variables to Vercel

echo "🚀 Smart Park - Vercel Environment Variables Setup"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Login to Vercel
echo "🔐 Please login to Vercel..."
vercel login

echo ""
echo "📝 Adding environment variables..."
echo ""

# Add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_URL production <<EOF
https://wzimrvfzmelgfcmuqqtw.supabase.co
EOF

vercel env add VITE_SUPABASE_URL preview <<EOF
https://wzimrvfzmelgfcmuqqtw.supabase.co
EOF

vercel env add VITE_SUPABASE_URL development <<EOF
https://wzimrvfzmelgfcmuqqtw.supabase.co
EOF

# Add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_ANON_KEY production <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aW1ydmZ6bWVsZ2ZjbXVxcXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjIzMTQsImV4cCI6MjA4NTA5ODMxNH0.-NIRkjr1wbOoXoIJU1XEajO5vtj5Nzj7JmhWTPVqBWE
EOF

vercel env add VITE_SUPABASE_ANON_KEY preview <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aW1ydmZ6bWVsZ2ZjbXVxcXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjIzMTQsImV4cCI6MjA4NTA5ODMxNH0.-NIRkjr1wbOoXoIJU1XEajO5vtj5Nzj7JmhWTPVqBWE
EOF

vercel env add VITE_SUPABASE_ANON_KEY development <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aW1ydmZ6bWVsZ2ZjbXVxcXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjIzMTQsImV4cCI6MjA4NTA5ODMxNH0.-NIRkjr1wbOoXoIJU1XEajO5vtj5Nzj7JmhWTPVqBWE
EOF

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "🔄 Triggering redeploy..."
vercel --prod

echo ""
echo "✨ Done! Your app will be live in 2-3 minutes."
echo "Visit: https://smart-par-k019.vercel.app"
