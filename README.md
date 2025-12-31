# 🎮 Mortal Kombat 11 Friends Tournament Manager

A full-stack web application for managing Mortal Kombat 11 friend tournaments with real-time match tracking, player statistics, animated live indicators, full CRUD operations, and a stunning dark neon-themed gaming UI.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### Tournament Management

- ✅ Create, edit, and delete tournaments
- ✅ Track tournament status (Upcoming, Ongoing, Ended)
- ✅ Automatic tournament ending when final match is completed
- ✅ Winner declaration and championship tracking

### Player System

- ✅ Add unlimited players to tournaments
- ✅ **Player rankings by wins with crown indicator for #1**
- ✅ Comprehensive player statistics tracking
  - Total matches played
  - Win count and win rate percentage
  - Character usage tracking with counts
- ✅ Detailed player profile pages

### Match Management

- ✅ Create matches between any two players
- ✅ **Edit matches at any time (live or completed)**
- ✅ **Delete live matches with confirmation**
- ✅ **Animated pulsing live indicator (🔴 LIVE)**
- ✅ Select characters for each player (all MK11 roster)
- ✅ Match types: Normal or Final
- ✅ **Automatic stat recalculation on match edits**
- ✅ Match status: Live or Completed
- ✅ Declare winners to automatically update player stats
- ✅ Latest matches appear first

### UI/UX

- ✅ Dark neon Mortal Kombat themed interface
- ✅ Smooth Framer Motion animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Toast notifications for user feedback
- ✅ Status badges (LIVE, ENDED, FINAL)
- ✅ Custom Orbitron gaming font
- ✅ Tailwind CSS utility-first styling

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

## 📁 Project Structure

```
mortal-kombat-tournament/
├── server/                 # Backend
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/
│   │   ├── Tournament.js  # Tournament schema
│   │   ├── Player.js      # Player schema
│   │   └── Match.js       # Match schema
│   ├── controllers/
│   │   ├── tournamentController.js
│   │   ├── playerController.js
│   │   └── matchController.js
│   ├── routes/
│   │   ├── tournamentRoutes.js
│   │   ├── playerRoutes.js
│   │   └── matchRoutes.js
│   ├── server.js          # Express server entry
│   ├── package.json
│   └── .env
│
└── client/                # Frontend
    ├── src/
    │   ├── components/
    │   │   ├── TournamentCard.tsx
    │   │   ├── MatchCard.tsx
    │   │   ├── PlayerStats.tsx
    │   │   ├── TournamentHeader.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Loading.tsx
    │   │   └── ErrorMessage.tsx
    │   ├── pages/
    │   │   ├── TournamentList.tsx
    │   │   ├── TournamentDetails.tsx
    │   │   └── PlayerProfile.tsx
    │   ├── services/
    │   │   └── api.ts        # Axios API layer
    │   ├── types/
    │   │   └── index.ts      # TypeScript types
    │   ├── utils/
    │   │   └── dateUtils.ts  # Date formatting
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Installation

#### 1. Clone the Repository

```bash
cd "e:\WebCode\FullStack Projects\mortal-kombat-tournament"
```

#### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (already created with default values)
# Default MongoDB connection: mongodb://localhost:27017/mortal-kombat-tournament
# Default PORT: 5000
```

#### 3. Setup Frontend

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# Windows (if MongoDB is installed as a service, it runs automatically)
# Or start manually:
mongod
```

### Start Backend Server

```bash
# From the server directory
cd server
npm run dev

# Server will start on http://localhost:5000
```

You should see:

```
✅ MongoDB Connected: localhost
📊 Database: mortal-kombat-tournament
🚀 Server running on port 5000
🎮 Mortal Kombat Tournament API Ready
📍 http://localhost:5000
```

### Start Frontend Development Server

```bash
# From the client directory (open a new terminal)
cd client
npm run dev

# Vite dev server will start on http://localhost:3000
```

You should see:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 🔌 API Endpoints

### Tournaments

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| GET    | `/api/tournaments`           | Get all tournaments       |
| GET    | `/api/tournaments/:id`       | Get tournament by ID      |
| POST   | `/api/tournaments`           | Create new tournament     |
| PUT    | `/api/tournaments/:id`       | Update tournament         |
| DELETE | `/api/tournaments/:id`       | Delete tournament         |
| GET    | `/api/tournaments/:id/stats` | Get tournament statistics |

### Players

| Method | Endpoint                      | Description                                       |
| ------ | ----------------------------- | ------------------------------------------------- |
| GET    | `/api/players?tournament=:id` | Get all players (optionally filter by tournament) |
| GET    | `/api/players/:id`            | Get player by ID                                  |
| POST   | `/api/players`                | Create new player                                 |
| PUT    | `/api/players/:id`            | Update player                                     |
| DELETE | `/api/players/:id`            | Delete player                                     |
| GET    | `/api/players/:id/matches`    | Get player match history                          |

### Matches

| Method | Endpoint                      | Description                                       |
| ------ | ----------------------------- | ------------------------------------------------- |
| GET    | `/api/matches?tournament=:id` | Get all matches (optionally filter by tournament) |
| GET    | `/api/matches/:id`            | Get match by ID                                   |
| POST   | `/api/matches`                | Create new match                                  |
| PUT    | `/api/matches/:id`            | Update match                                      |
| DELETE | `/api/matches/:id`            | Delete match                                      |
| PUT    | `/api/matches/:id/complete`   | Complete match and declare winner                 |

---

## 📊 Database Schema

### Tournament Model

```javascript
{
  name: String,              // Tournament name
  status: String,            // 'upcoming' | 'live' | 'ended'
  startTime: Date,           // Start date and time
  endTime: Date,             // End date and time (optional)
  winner: ObjectId,          // Reference to Player (optional)
  players: [ObjectId],       // Array of Player references
  matches: [ObjectId],       // Array of Match references
  timestamps: true
}
```

### Player Model

```javascript
{
  name: String,              // Player name (unique per tournament)
  tournament: ObjectId,      // Reference to Tournament
  matchesPlayed: Number,     // Total matches (default: 0)
  wins: Number,              // Total wins (default: 0)
  charactersUsed: Map,       // { characterName: usageCount }
  winRate: Number,           // Calculated virtual field
  timestamps: true
}
```

### Match Model

```javascript
{
  tournament: ObjectId,      // Reference to Tournament
  player1: ObjectId,         // Reference to Player
  player2: ObjectId,         // Reference to Player
  player1Character: String,  // Character name
  player2Character: String,  // Character name
  matchType: String,         // 'normal' | 'final'
  status: String,            // 'live' | 'completed'
  winner: ObjectId,          // Reference to Player (optional)
  timestamps: true
}
```

---

## 🎯 Key Features Explained

### Automatic Tournament Ending

When a match marked as "final" is completed:

1. Winner is declared
2. Tournament status automatically changes to "ended"
3. Tournament winner is set to the match winner
4. No more matches or players can be added

### Player Statistics Auto-Update

When a match is completed:

1. Both players' `matchesPlayed` count increases by 1
2. Winner's `wins` count increases by 1
3. Both players' `charactersUsed` map updates with character usage
4. Win rate automatically recalculated

### Match Display Order

- Matches are displayed in reverse chronological order
- Latest matches appear first
- Helps track tournament progression in real-time

---

## 🎨 UI Theme

### Color Palette

- **Primary (MK Yellow)**: `#FFD700`
- **Danger (Neon Red)**: `#FF073A`
- **Info (Neon Blue)**: `#00F0FF`
- **Success (MK Green)**: `#00FF41`
- **Background**: Dark gradients with `gray-950`

### Typography

- **Font Family**: Orbitron (gaming-style)
- **Weights**: 400-900 range for variety

### Animations

- Page transitions with Framer Motion
- Hover effects with scale transformations
- Pulse animations for "LIVE" badges
- Smooth color transitions

---

## 🧪 Development Tips

### Backend Development

```bash
# Auto-restart on file changes
cd server
npm run dev
```

### Frontend Development

```bash
# Hot module replacement enabled
cd client
npm run dev
```

### Building for Production

**Backend:**

```bash
cd server
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm run preview  # Preview production build
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check connection string in `server/.env`
- Default: `mongodb://localhost:27017/mortal-kombat-tournament`

### Port Already in Use

- Backend: Change `PORT` in `server/.env`
- Frontend: Vite will auto-increment if 3000 is busy

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Sample Data Flow

1. **Create Tournament**

   - POST `/api/tournaments`
   - Body: `{ name, status, startTime }`

2. **Add Players**

   - POST `/api/players`
   - Body: `{ name, tournament: tournamentId }`

3. **Create Match**

   - POST `/api/matches`
   - Body: `{ tournament, player1, player2, player1Character, player2Character, matchType, status }`

4. **Complete Match**

   - PUT `/api/matches/:id/complete`
   - Body: `{ winnerId }`
   - Automatically updates player stats

5. **View Results**
   - GET `/api/tournaments/:id`
   - Returns tournament with populated players, matches, and winner

---

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

---

## 📄 License

MIT License - Feel free to use this project for your own tournaments!

---

## 🎮 Mortal Kombat 11 Characters Included

The application includes all 37 MK11 characters:

- Base Roster: Scorpion, Sub-Zero, Raiden, Liu Kang, Kung Lao, Kitana, Jade, Cassie Cage, Johnny Cage, Sonya Blade, Jax, Jacqui Briggs, Kano, Kabal, Baraka, Skarlet, Erron Black, D'Vorah, Kotal Kahn, Shao Kahn, Cetrion, Kollector, Geras, Frost, Noob Saibot
- DLC: Shang Tsung, Nightwolf, Sindel, Joker, Terminator, Spawn, Fujin, Sheeva, RoboCop, Rambo, Rain, Mileena

---

## 🌐 Deployment to Production

This application is ready to deploy to Vercel with MongoDB Atlas!

### Quick Deploy Steps

1. **Set up MongoDB Atlas** (free tier available)
2. **Deploy backend** to Vercel (`server` folder)
3. **Deploy frontend** to Vercel (`client` folder)
4. **Configure environment variables** in Vercel dashboard
5. **Test production deployment**

### 📘 Full Deployment Guide

For detailed step-by-step instructions including:

- MongoDB Atlas setup and configuration
- Vercel deployment for backend and frontend
- Environment variable configuration
- CORS setup
- Troubleshooting common issues
- Security best practices

**👉 See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

### Environment Files Included

- `server/.env.example` - Backend environment variables template
- `client/.env.example` - Frontend environment variables template
- `server/vercel.json` - Backend Vercel configuration (ready to use)

---

## 💡 Future Enhancement Ideas

- [ ] Real-time updates with WebSockets
- [ ] Tournament brackets visualization
- [ ] Player avatars and profiles
- [ ] Match replay/notes system
- [ ] Tournament export to PDF
- [ ] Leaderboard across all tournaments
- [ ] Authentication and user accounts
- [ ] Tournament templates
- [ ] Character statistics across all matches

---

## 📧 Support

For issues or questions:

1. Check the troubleshooting section
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
3. Review the API endpoints documentation
4. Inspect browser console for frontend errors
5. Check server terminal for backend errors

---

**Built with ❤️ for Mortal Kombat fans**

**FINISH HIM! 🎮⚔️**
