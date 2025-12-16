# How to Test the Application

## ✅ Application is Running!

The server is running on **http://localhost:3000**

## Quick Test Guide

### Step 1: Test the Room Selector
1. Open your browser to `http://localhost:3000`
2. You should see the purple gradient room selector interface
3. Enter your name (e.g., "Alice")
4. Enter a room name (e.g., "TestRoom")
5. Click "Join Room"

### Step 2: Test Multi-User Functionality
1. **Open a second browser tab** to `http://localhost:3000`
2. Enter a different name (e.g., "Bob")
3. Enter the **same room name** ("TestRoom")
4. Click "Join Room"
5. **Move your mouse** in one tab
6. **Watch the cursor appear** in the other tab!

### Step 3: Verify Features
- ✅ Each user has a unique color
- ✅ User names appear next to cursors
- ✅ Cursors are drawn as colored circles
- ✅ Users list shows in the right sidebar
- ✅ Maximum 10 users per room enforced

### Step 4: Test Room Switching
1. Click "Change Room" button in the header
2. Join a different room
3. Verify you only see users from the new room

## Troubleshooting

**If you see a blank screen:**
1. Hard refresh the page (Ctrl + Shift + R)
2. Check browser console for errors (F12)

**If cursors don't appear:**
1. Make sure both users joined the **same room**
2. Check that the server is running
3. Look for Socket.IO connection in browser console

## Server Control

**To stop the server:**
- Press Ctrl+C in the terminal where server is running
- Or use Task Manager to end the Node.js process

**To restart the server:**
```bash
node server.js
```

---

**Enjoy testing your collaborative canvas! 🎨✨**
