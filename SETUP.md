# 🚀 Quick Setup Guide

## New Repository Structure

Your repository has been reorganized into a professional monorepo:

```
smart-park/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── index.js
│   └── package.json
├── .env              # Environment variables
├── package.json      # Root workspace config
└── README.md
```

## 🔧 Setup Instructions

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install All Project Dependencies
```bash
npm run install:all
```

This will install dependencies for both frontend and backend.

### 3. Start Development Servers

**Option A: Run both servers concurrently**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

## 📦 Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend (port 5173)
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both projects
- `npm run build:frontend` - Build frontend only
- `npm run build:backend` - Build backend only

## 🌐 Deployment Notes

### Frontend (Vercel)
You'll need to update your Vercel configuration:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`

### Backend (Render)
Update `render.yaml` if needed to point to the backend directory.

## ⚠️ Important

After this restructure, you need to:
1. Run `npm run install:all` to set up all dependencies
2. Update your Vercel project settings to use the `frontend` directory
3. Restart your development servers

## 🎯 Next Steps

1. Install dependencies: `npm run install:all`
2. Start dev servers: `npm run dev`
3. Update Vercel settings for the frontend directory
4. Test the application locally

Your repository is now properly organized for scalable full-stack development! 🎉
