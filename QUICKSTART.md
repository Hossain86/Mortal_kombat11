# 🚀 Quick Start Guide

## Prerequisites Check

✅ Node.js installed? Run: `node --version`
✅ MongoDB installed? Run: `mongod --version`

## Setup in 3 Steps

### Step 1: Install Dependencies

**Backend:**

```powershell
cd server
npm install
```

**Frontend:**

```powershell
cd client
npm install
```

### Step 2: Start MongoDB

Make sure MongoDB is running. If installed as Windows service, it should already be running.
Otherwise:

```powershell
mongod
```

### Step 3: Run the Application

**Terminal 1 - Backend:**

```powershell
cd server
npm run dev
```

Wait for: `✅ MongoDB Connected` and `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**

```powershell
cd client
npm run dev
```

Wait for: `Local: http://localhost:3000/`

### Step 4: Open Browser

Navigate to: **http://localhost:3000**

---

## First Time Usage

1. **Create a Tournament**

   - Click "New Tournament" button
   - Enter name, select status, choose start time
   - Click "Create Tournament"

2. **Add Players**

   - Click on the tournament card
   - Click "Add Player" button
   - Enter player names (minimum 2 players needed)

3. **Create Matches**

   - Click "Add Match" button
   - Select Player 1 and Player 2
   - Choose characters for each player
   - Select match type (normal or final)
   - Click "Create Match"

4. **Complete Matches**
   - Click "Declare Winner" button on live matches
   - Player stats will automatically update
   - If match is "final", tournament ends automatically

---

## Troubleshooting

**MongoDB not connecting?**

- Check if MongoDB service is running
- Verify connection string in `server/.env`

**Port 5000 already in use?**

- Change PORT in `server/.env` file

**Port 3000 already in use?**

- Vite will automatically try 3001, 3002, etc.

**Dependencies not installing?**

```powershell
npm cache clean --force
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

---

## Test the API

```powershell
# Health check
curl http://localhost:5000/api/health

# Get all tournaments
curl http://localhost:5000/api/tournaments
```

---

**Ready to Fight! 🎮⚔️**
