# Collaborative Canvas - Real-time Cursor Sharing

A real-time collaborative canvas application where users can see each other's cursors moving in real-time, organized by rooms with configurable user limits.

## 🎨 Features

- **Real-time Cursor Tracking**: See everyone's cursor movements in real-time
- **Room Support**: Create or join rooms to collaborate with specific groups
- **User Limit**: Maximum 10 users per room (configurable)
- **Unique Colors**: Each user gets a randomly generated unique color
- **User List**: See who's in your current room
- **Room Switching**: Change rooms without disconnecting
- **Premium UI**: Modern, glassmorphic design with smooth animations

## 🛠️ Technologies

- **Frontend**: Vue.js 3 (CDN), HTML5 Canvas
- **Backend**: Node.js, Express, Socket.IO
- **Real-time**: WebSocket communication via Socket.IO

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install:
- express
- socket.io
- cors

### 2. Start the Server

```bash
npm start
```

Or:

```bash
node server.js
```

The server will start on `http://localhost:3000`

### 3. Open in Browser

Open your browser and navigate to:

```
http://localhost:3000
```

### 4. Test with Multiple Users

To test the collaborative features:
1. Open multiple browser tabs/windows
2. Enter different names in each tab
3. Join the same room
4. Move your mouse and see the cursors appear in all tabs!

## 📁 Project Structure

```
Act3/
├── server.js              # Express + Socket.IO server
├── package.json           # Project dependencies
├── index.html            # Main HTML entry point
├── src/
│   ├── main.js           # Vue app initialization
│   ├── App.vue           # Root component
│   ├── style.css         # Global styles
│   └── components/
│       ├── RoomSelector.vue  # Room selection interface
│       └── Canvas.vue        # Canvas with cursor rendering
└── README.md             # This file
```

## 🎮 How to Use

1. **Enter Your Name**: When you first load the app, enter your name
2. **Choose a Room**: Either type a new room name or click on an available room
3. **Join**: Click "Join Room" to enter
4. **Collaborate**: Move your mouse to see your cursor, and watch others' cursors move in real-time!
5. **Switch Rooms**: Click "Change Room" in the header to join a different room

## ⚙️ Configuration

You can modify the following in `server.js`:

- **MAX_USERS_PER_ROOM**: Change the maximum number of users allowed per room (default: 10)
- **PORT**: Change the server port (default: 3000)

## 🌐 Deployment

### For Local Testing (Labs)

If deploying to a university lab server:

1. Make sure Node.js is installed on the server
2. Upload all project files
3. Install dependencies: `npm install`
4. Start the server: `node server.js`
5. Access via the server's IP/domain: `http://[server-address]:3000`

### For Production Deployment

The application can be deployed to various platforms:

#### Option 1: Render (Recommended - Free Tier Available)

1. Create account at [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Deploy!

#### Option 2: Railway

1. Create account at [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Railway auto-detects Node.js
4. Deploy automatically!

#### Option 3: Heroku

1. Create account at [Heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run:
```bash
heroku create
git push heroku main
```

### Important for Deployment

When deploying, update the Socket.IO connection URL in `src/App.vue`:

```javascript
// Change this line (around line 25):
this.socket = io('http://localhost:3000');

// To your production URL:
this.socket = io('https://your-app-url.com');
```

Or make it dynamic:
```javascript
const serverUrl = window.location.origin;
this.socket = io(serverUrl);
```

## 📦 Creating ZIP for Submission

To create a ZIP file for submission:

### Windows:
1. Right-click on the `Act3` folder
2. Select "Send to" → "Compressed (zipped) folder"

### Command Line:
```bash
# Navigate to parent directory
cd ..
# Create ZIP (requires 7zip or similar)
7z a Act3.zip Act3/
```

## 🐛 Troubleshooting

**Port already in use:**
- Change the PORT in server.js to a different number (e.g., 3001, 8080)

**Cannot connect to server:**
- Make sure the server is running
- Check the console for the server URL
- Verify firewall settings

**npm not found:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

**Cursors not showing:**
- Make sure you're in the same room as other users
- Check browser console for errors
- Verify Socket.IO connection is established

## 📝 Technical Details

### Socket.IO Events

**Client → Server:**
- `registerUser`: Register user with name, color, and room
- `mousemove`: Send cursor position (x, y)
- `change_room`: Request to change rooms
- `get_rooms`: Request list of available rooms

**Server → Client:**
- `joined_room`: Confirmation of successful room join
- `room_full`: Error when room is at capacity
- `room_users`: Updated list of users in current room
- `user_cursor_move`: Other user's cursor position
- `rooms_list`: List of available rooms

### Data Storage

User information is stored directly in the socket object:
- `socket.userName`: User's display name
- `socket.color`: User's cursor color (HSL format)
- `socket.roomName`: Current room name

This ensures data is automatically cleaned up on disconnect.

## 📄 License

MIT License - Feel free to use this for educational purposes.

## 👤 Author

Created for DAW2 - Activity 3

---

**Enjoy collaborating in real-time! 🎨✨**
