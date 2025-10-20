# 🚀 Deployment Guide - FitLoop

## Quick Deploy Options

### Option 1: Railway (Recommended for Full-Stack)

Railway is perfect for your app because it handles both frontend and backend together.

#### Step-by-Step:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/fitloop.git
   git push -u origin main
   ```

3. **Create New Project on Railway**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `fitloop` repository
   - Railway will auto-detect it's a Node.js app

4. **Configure Environment Variables**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add: `VITE_REPLICATE_API_KEY` with your Replicate API key
   - Railway will auto-restart

5. **Get Your URL**
   - Railway generates a URL like: `fitloop-production.up.railway.app`
   - Click "Generate Domain" if not auto-generated
   - Your app is live! 🎉

#### Automatic Deployments
- Every `git push` to `main` will auto-deploy
- Build status shows in Railway dashboard
- Rollback available if needed

---

### Option 2: Vercel (Frontend) + Railway (Backend)

Split deployment for better optimization.

#### Backend (Railway):
1. Create new Railway project
2. Deploy from GitHub
3. Add environment variable: `VITE_REPLICATE_API_KEY`
4. Note your backend URL: `https://your-app.up.railway.app`

#### Frontend (Vercel):
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Update API URL**
   - Edit `src/services/tryonAPI.js`
   - Change `http://localhost:3001/api` to your Railway backend URL

3. **Deploy to Vercel**
   ```bash
   vercel
   ```
   
4. **Auto-Deploy Setup**
   - Connect GitHub repo in Vercel dashboard
   - Every push to `main` auto-deploys

---

### Option 3: Render (Free Tier Available)

#### Step-by-Step:

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo

3. **Configure Build**
   - **Name**: fitloop
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

4. **Environment Variables**
   - Add `VITE_REPLICATE_API_KEY`
   - Your Replicate API key

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy
   - Get your URL: `https://fitloop.onrender.com`

---

## 📋 Pre-Deployment Checklist

- [ ] Pushed code to GitHub
- [ ] `.env` file is in `.gitignore` (never commit API keys!)
- [ ] `VITE_REPLICATE_API_KEY` ready to add as environment variable
- [ ] Tested locally with `npm run start`
- [ ] All dependencies in `package.json`

---

## 🔧 CI/CD Setup (GitHub Actions)

I've created `.github/workflows/deploy.yml` for you.

### Activate GitHub Actions:

1. **Get Railway Token**
   - Go to Railway dashboard → Account Settings
   - Create new token
   - Copy the token

2. **Add to GitHub Secrets**
   - Go to your GitHub repo
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `RAILWAY_TOKEN`
   - Value: (paste your Railway token)

3. **Push to Trigger**
   ```bash
   git add .
   git commit -m "Add deployment config"
   git push
   ```
   
   - GitHub Actions will automatically run
   - Deploys to Railway on success
   - Check "Actions" tab in GitHub for status

---

## 🌐 Custom Domain (Optional)

### On Railway:
1. Go to project settings
2. Click "Domains"
3. Add custom domain: `www.fitloop.com`
4. Follow DNS instructions
5. SSL certificate auto-generated

### On Vercel:
1. Project Settings → Domains
2. Add domain
3. Configure DNS
4. SSL auto-enabled

---

## 📊 Monitoring & Logs

### Railway:
- Real-time logs in dashboard
- Usage metrics available
- Alerts for crashes

### Vercel:
- Deployment logs
- Analytics dashboard
- Performance monitoring

### Render:
- Live logs
- Metrics dashboard
- Email alerts

---

## 🔄 Deployment Workflow

```
Local Development
     ↓
git commit
     ↓
git push to main
     ↓
GitHub Actions (CI)
  - Runs tests
  - Builds app
     ↓
Deploy to Railway (CD)
  - Installs dependencies
  - Builds production
  - Starts server
     ↓
Live at your URL! 🎉
```

---

## 💰 Cost Estimates

### Railway
- **Free tier**: $5 credit/month
- **Pro**: $20/month (includes $20 usage)
- Your app: ~$5-10/month estimated

### Vercel
- **Hobby**: Free forever
- **Pro**: $20/month (if needed)

### Render
- **Free**: Limited (sleeps after 15min inactivity)
- **Starter**: $7/month (always on)

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (use 18 or 20)
- Verify all dependencies installed
- Check build logs for errors

### App Not Starting
- Ensure `npm run start` works locally
- Check environment variables set
- Verify port configuration (Railway auto-assigns)

### API Errors
- Confirm `VITE_REPLICATE_API_KEY` is set
- Check backend URL is correct
- Verify CORS settings

### Camera Not Working
- Ensure HTTPS is enabled (Railway/Vercel do this automatically)
- Check browser permissions
- Test on different browsers

---

## 📱 Mobile Considerations

Your app works on mobile, but:
- Camera needs HTTPS (production has this)
- Portrait mode works best
- Test on actual devices
- Consider PWA for app-like experience

---

## 🚀 Quick Start Commands

```bash
# Deploy to Railway (after setup)
git add .
git commit -m "Deploy to production"
git push

# Deploy to Vercel
vercel --prod

# Check deployment status
railway status

# View logs
railway logs

# Rollback (if needed)
railway rollback
```

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [GitHub Actions](https://docs.github.com/actions)

---

## ✅ Success Checklist

After deployment:
- [ ] App loads at production URL
- [ ] Camera permissions work (HTTPS required)
- [ ] Can browse t-shirts with carousel
- [ ] Try-on button works
- [ ] API calls succeed (check for API errors)
- [ ] Results display correctly
- [ ] Tested on mobile device
- [ ] Custom domain configured (optional)
- [ ] Monitoring/alerts set up

---

Need help? Check the logs first, then refer to platform documentation!

Good luck with your deployment! 🎉

