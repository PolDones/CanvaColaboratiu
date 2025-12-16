# Deployment Instructions

## Quick Deploy Options

### Option 1: Render.com (Recommended - Free)

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select your repository
4. Configure:
   - **Name**: collaborative-canvas
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Once deployed, update `src/App.vue` line 25:
   ```javascript
   this.socket = io(window.location.origin);
   ```
7. Your app will be live at: `https://collaborative-canvas-xxxx.onrender.com`

### Option 2: Railway.app (Free Tier)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys
6. Update Socket.IO URL as above
7. Access your app from the provided Railway URL

### Option 3: Fly.io (Free Tier)

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Run:
   ```bash
   fly auth login
   cd Act3
   fly launch
   ```
3. Follow prompts to deploy
4. Update Socket.IO URL in App.vue

### Option 4: Local Network (For Lab Testing)

1. Find your local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
   
2. Start server:
   ```bash
   node server.js
   ```

3. Share with others on same network:
   - They can access at: `http://YOUR-IP:3000`
   - Example: `http://192.168.1.100:3000`

4. Update App.vue to use dynamic URL:
   ```javascript
   this.socket = io(window.location.origin);
   ```

## Important: Update Socket.IO Connection

After deployment, edit `src/App.vue` (around line 25):

**Change from:**
```javascript
this.socket = io('http://localhost:3000');
```

**To:**
```javascript
// Dynamic - works for any deployment
this.socket = io(window.location.origin);
```

This will automatically connect to the correct server URL.

## Environment Variables (Optional)

For production, you can set PORT via environment variable:

**server.js** already supports this:
```javascript
const PORT = process.env.PORT || 3000;
```

Most platforms (Render, Railway, Heroku) set PORT automatically.

## CORS Configuration

The server is configured to accept connections from any origin:
```javascript
cors: {
  origin: "*",
  methods: ["GET", "POST"]
}
```

For production, you may want to restrict this to your domain:
```javascript
cors: {
  origin: "https://your-domain.com",
  methods: ["GET", "POST"]
}
```

## Creating ZIP for Submission

### Windows PowerShell:
```powershell
Compress-Archive -Path "c:\Users\poldo\Desktop\proyectos\daw\daw2\opt\Act3" -DestinationPath "c:\Users\poldo\Desktop\proyectos\daw\daw2\opt\Act3.zip"
```

### Using File Explorer:
1. Navigate to: `c:\Users\poldo\Desktop\proyectos\daw\daw2\opt`
2. Right-click on `Act3` folder
3. Select "Send to" → "Compressed (zipped) folder"
4. Rename to `Act3.zip` if needed

## Submission Checklist

- [ ] Code is in a ZIP file
- [ ] README.md included with instructions
- [ ] Application deployed to a public URL
- [ ] Test with multiple browser tabs
- [ ] Verify room creation and joining works
- [ ] Verify user limit enforcement (10 users max)
- [ ] Verify cursors appear in real-time
- [ ] Submit ZIP file
- [ ] Submit deployment URL

## Testing Deployed Application

1. Open your deployed URL in multiple browser tabs
2. Enter different names in each tab
3. All join the same room
4. Move mouse in each tab
5. Verify all cursors appear in all tabs
6. Test room switching
7. Test user limit (try to join with 11+ users)
