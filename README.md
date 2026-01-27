# Smart Park - Intelligent Valet Parking System

A comprehensive full-stack smart parking solution with automated valet services, real-time tracking, and intelligent space management.

## 🏗️ Project Structure

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
└── package.json      # Root workspace configuration
```

## 🚀 Features

### Frontend
- **User Dashboard**: Real-time parking session management
- **QR Scanner**: Quick vehicle check-in/check-out
- **Vehicle Management**: Register and manage multiple vehicles
- **Digital Tickets**: Live parking session tracking
- **Live Map**: Interactive parking location finder
- **AI Chatbot**: Voice-enabled parking assistant
- **Analytics Dashboard**: Business intelligence and metrics

### Backend
- RESTful API for parking operations
- Session management
- Payment processing integration
- Real-time data synchronization

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Leaflet with Mapbox
- **State Management**: React Hooks + Context
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or bun

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aaditya29112005/smart-parK019.git
   cd smart-parK019
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development servers**
   ```bash
   npm run dev
   ```
   
   This will start both frontend (http://localhost:5173) and backend servers concurrently.

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📱 Demo Mode

The application includes a **Demo Mode** that works without database connectivity:
1. Visit the login page
2. Click "Demo Access"
3. Explore all features with pre-seeded data

## 🌐 Deployment

### Frontend (Vercel)
The frontend is automatically deployed to Vercel on push to main branch.

**Live URL**: [smart-par-k019.vercel.app](https://smart-par-k019.vercel.app)

### Backend (Render)
Backend API is deployed on Render.

## 🎨 Design Philosophy

- **Cyber-Inspired Aesthetics**: Modern, premium UI with glassmorphic elements
- **Mobile-First**: Optimized for mobile devices with responsive design
- **Real-Time Updates**: Live data synchronization across all components
- **Production-Ready**: Seeded with realistic data for demonstrations

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Aaditya Mohan Samadhiya

## 🙏 Acknowledgments

Built with modern web technologies and best practices for a seamless parking experience.
