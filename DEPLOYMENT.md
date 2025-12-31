# 🎮 Mortal Kombat 11 Tournament Manager - Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Build a Database"**
3. Choose **FREE** tier (M0 Sandbox)
4. Select your preferred **Cloud Provider** and **Region**
5. Name your cluster (e.g., `mk-tournament-cluster`)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 2: Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Set username and generate a strong password
5. Under **Database User Privileges**, select **"Read and write to any database"**
6. Click **"Add User"**
7. **⚠️ SAVE THE PASSWORD** - you'll need it for the connection string!

### Step 3: Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Vercel deployment)
   - This adds `0.0.0.0/0` which allows connections from any IP
   - ⚠️ Security Note: This is safe because MongoDB still requires authentication
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go back to **Database** section
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your actual password
7. Add the database name after `.net/`:
   ```
   mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/mortal-kombat-tournament?retryWrites=true&w=majority
   ```

---

## 🚀 Backend Deployment (Vercel)

### Step 1: Prepare Backend

1. Make sure `vercel.json` exists in the `server` folder (already created)
2. Verify `.env.example` exists in the `server` folder

### Step 2: Deploy Backend to Vercel

#### Option A: Using Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to server folder
cd server

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Set **Root Directory** to `server`
5. Click **"Deploy"**

### Step 3: Configure Backend Environment Variables

1. In Vercel Dashboard, go to your backend project
2. Click **"Settings"** → **"Environment Variables"**
3. Add the following variables:

   | Name          | Value                                         | Environment |
   | ------------- | --------------------------------------------- | ----------- |
   | `MONGODB_URI` | Your MongoDB Atlas connection string          | All         |
   | `NODE_ENV`    | `production`                                  | Production  |
   | `CORS_ORIGIN` | Your frontend URL (add after frontend deploy) | Production  |

4. Click **"Save"**
5. Redeploy the project to apply changes

### Step 4: Note Your Backend URL

- After deployment, copy your backend URL (e.g., `https://mk-tournament-backend.vercel.app`)
- You'll need this for frontend configuration

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Create .env File for Production

Create a `.env.production` file in the `client` folder:

```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
```

Replace `your-backend-url` with your actual backend Vercel URL from previous step.

### Step 2: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI

```powershell
# Navigate to client folder
cd client

# Deploy
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository again (or select it)
4. Set **Root Directory** to `client`
5. **Framework Preset**: Vite
6. Click **"Deploy"**

### Step 3: Configure Frontend Environment Variables

1. In Vercel Dashboard, go to your frontend project
2. Click **"Settings"** → **"Environment Variables"**
3. Add:

   | Name                | Value                                     | Environment |
   | ------------------- | ----------------------------------------- | ----------- |
   | `VITE_API_BASE_URL` | `https://your-backend-url.vercel.app/api` | Production  |

4. Click **"Save"**
5. Redeploy if needed

### Step 4: Update Backend CORS

1. Go back to your **backend** project in Vercel
2. Go to **"Settings"** → **"Environment Variables"**
3. Update `CORS_ORIGIN` to your frontend URL:
   ```
   https://your-frontend-app.vercel.app
   ```
4. Redeploy the backend

---

## ✅ Verification

### Test Your Deployment

1. Visit your frontend URL
2. Try creating a tournament
3. Add players
4. Create matches
5. Verify all CRUD operations work

### Common Issues & Fixes

#### 🔴 CORS Errors

- **Problem**: Frontend can't connect to backend
- **Solution**: Double-check `CORS_ORIGIN` in backend matches frontend URL exactly
- **Redeploy**: Backend must be redeployed after changing env vars

#### 🔴 Database Connection Failed

- **Problem**: Backend can't connect to MongoDB
- **Solution**:
  - Verify MongoDB connection string is correct
  - Check IP whitelist includes `0.0.0.0/0`
  - Ensure password doesn't contain special characters that need URL encoding

#### 🔴 API 404 Errors

- **Problem**: Frontend gets 404 when calling API
- **Solution**:
  - Verify `VITE_API_BASE_URL` includes `/api` at the end
  - Check backend is deployed and running
  - Check Vercel logs for backend errors

#### 🔴 Environment Variables Not Working

- **Problem**: Changes to env vars not taking effect
- **Solution**:
  - Click **"Redeploy"** after changing environment variables
  - Vercel requires redeployment for env var changes to apply

---

## 🔄 Continuous Deployment

Once set up, Vercel automatically deploys:

- **Pushes to `main` branch** → Production deployment
- **Pull requests** → Preview deployments

### Recommended Workflow

1. Develop locally with `npm run dev`
2. Test thoroughly
3. Commit and push to Git
4. Vercel auto-deploys
5. Test production deployment

---

## 📊 Monitoring

### Vercel Analytics

- Enable in Project Settings → Analytics
- Track page views, performance, and errors

### MongoDB Atlas Monitoring

- Go to Atlas Dashboard → Monitoring tab
- View database operations, connections, and performance

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - already in `.gitignore`
2. **Use strong passwords** for MongoDB users
3. **Rotate secrets regularly** - update MongoDB password every 3-6 months
4. **Monitor access logs** in both Vercel and MongoDB Atlas
5. **Enable 2FA** on both Vercel and MongoDB Atlas accounts

---

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Use browser DevTools Network tab to inspect API calls
4. Verify all environment variables are set correctly

---

## 📝 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained and formatted
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set (MONGODB_URI, CORS_ORIGIN)
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set (VITE_API_BASE_URL)
- [ ] Backend CORS updated with frontend URL
- [ ] Both projects redeployed after env var changes
- [ ] Tested creating tournament, players, and matches
- [ ] Verified all CRUD operations work in production

---

## 🎉 Success!

Your Mortal Kombat 11 Tournament Manager is now live! Share your frontend URL with friends to start managing tournaments.

**Frontend**: `https://your-frontend.vercel.app`  
**Backend**: `https://your-backend.vercel.app`  
**Database**: MongoDB Atlas (cloud-hosted)
