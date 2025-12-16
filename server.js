import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuration
const MAX_USERS_PER_ROOM = 10;

// Serve static files
app.use(cors());

// Set correct MIME types for JavaScript modules
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

app.use(express.static(__dirname));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Handle user registration
  socket.on('registerUser', async (data) => {
    const { name, color, room } = data;

    // Check if room is full
    const roomSockets = await io.in(room).fetchSockets();

    if (roomSockets.length >= MAX_USERS_PER_ROOM) {
      socket.emit('room_full', {
        message: `Room "${room}" is full (max ${MAX_USERS_PER_ROOM} users)`
      });
      return;
    }

    // Store user information in socket
    socket.userName = name;
    socket.color = color;
    socket.roomName = room;

    // Join the room
    socket.join(room);

    console.log(`User ${name} joined room ${room}`);

    // Notify the user of successful join
    socket.emit('joined_room', {
      room: room,
      userName: name,
      color: color
    });

    // Get updated list of users in the room
    const updatedRoomSockets = await io.in(room).fetchSockets();
    const users = updatedRoomSockets.map(s => ({
      id: s.id,
      userName: s.userName,
      color: s.color
    }));

    // Broadcast updated user list to everyone in the room
    io.to(room).emit('room_users', users);
  });

  // Handle mouse movement
  socket.on('mousemove', (data) => {
    if (!socket.roomName) return;

    const { x, y } = data;
    const { userName, color } = socket;

    // Broadcast to all other users in the same room
    socket.to(socket.roomName).emit('user_cursor_move', {
      id: socket.id,
      userName,
      color,
      x,
      y
    });
  });

  // Handle room change
  socket.on('change_room', async (data) => {
    const { room } = data;
    const oldRoom = socket.roomName;

    // Check if new room is full
    const roomSockets = await io.in(room).fetchSockets();

    if (roomSockets.length >= MAX_USERS_PER_ROOM) {
      socket.emit('room_full', {
        message: `Room "${room}" is full (max ${MAX_USERS_PER_ROOM} users)`
      });
      return;
    }

    // Leave old room
    if (oldRoom) {
      socket.leave(oldRoom);

      // Update user list in old room
      const oldRoomSockets = await io.in(oldRoom).fetchSockets();
      const oldRoomUsers = oldRoomSockets.map(s => ({
        id: s.id,
        userName: s.userName,
        color: s.color
      }));
      io.to(oldRoom).emit('room_users', oldRoomUsers);
    }

    // Join new room
    socket.roomName = room;
    socket.join(room);

    // Notify user of successful room change
    socket.emit('joined_room', {
      room: room,
      userName: socket.userName,
      color: socket.color
    });

    // Update user list in new room
    const newRoomSockets = await io.in(room).fetchSockets();
    const newRoomUsers = newRoomSockets.map(s => ({
      id: s.id,
      userName: s.userName,
      color: s.color
    }));
    io.to(room).emit('room_users', newRoomUsers);
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);

    if (socket.roomName) {
      // Update user list in the room
      const roomSockets = await io.in(socket.roomName).fetchSockets();
      const users = roomSockets.map(s => ({
        id: s.id,
        userName: s.userName,
        color: s.color
      }));
      io.to(socket.roomName).emit('room_users', users);
    }
  });

  // Get list of available rooms
  socket.on('get_rooms', async () => {
    const rooms = [];
    const allRooms = io.sockets.adapter.rooms;

    for (const [roomName, socketSet] of allRooms) {
      // Skip rooms that are just socket IDs (personal rooms)
      const isPersonalRoom = io.sockets.sockets.has(roomName);
      if (!isPersonalRoom) {
        const roomSockets = await io.in(roomName).fetchSockets();
        rooms.push({
          name: roomName,
          users: roomSockets.length,
          maxUsers: MAX_USERS_PER_ROOM,
          isFull: roomSockets.length >= MAX_USERS_PER_ROOM
        });
      }
    }

    socket.emit('rooms_list', rooms);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Maximum users per room: ${MAX_USERS_PER_ROOM}`);
});
