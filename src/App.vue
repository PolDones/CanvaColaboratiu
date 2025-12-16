export default {
  template: `
    <component 
      :is="currentView"
      :user-name="userData.name"
      :user-color="userData.color"
      :current-room="userData.room"
      :ref="'currentComponent'"
      @join="handleJoin"
      @refresh-rooms="handleRefreshRooms"
      @cursor-move="handleCursorMove"
      @change-room="handleChangeRoom"
    />
  `,
  data() {
    return {
      currentView: 'room-selector',
      socket: null,
      userData: {
        name: '',
        color: '',
        room: ''
      }
    };
  },
  methods: {
    initSocket() {
      // Connect to server (change localhost:3000 to your server URL in production)
      this.socket = io('http://localhost:3000');

      // Handle successful room join
      this.socket.on('joined_room', (data) => {
        this.userData = {
          name: data.userName,
          color: data.color,
          room: data.room
        };
        this.currentView = 'canvas-view';
      });

      // Handle room full error
      this.socket.on('room_full', (data) => {
        const roomSelector = this.$refs.currentComponent;
        if (roomSelector && roomSelector.setError) {
          roomSelector.setError(data.message);
        }
      });

      // Handle room users update
      this.socket.on('room_users', (users) => {
        const canvas = this.$refs.currentComponent;
        if (canvas && canvas.updateRoomUsers) {
          canvas.updateRoomUsers(users);
        }
      });

      // Handle cursor movement from other users
      this.socket.on('user_cursor_move', (data) => {
        const canvas = this.$refs.currentComponent;
        if (canvas && canvas.addCursor) {
          canvas.addCursor(data);
        }
      });

      // Handle rooms list
      this.socket.on('rooms_list', (rooms) => {
        const roomSelector = this.$refs.currentComponent;
        if (roomSelector && roomSelector.availableRooms !== undefined) {
          roomSelector.availableRooms = rooms;
        }
      });
    },
    handleJoin(data) {
      if (this.socket) {
        this.socket.emit('registerUser', data);
      }
    },
    handleRefreshRooms() {
      if (this.socket) {
        this.socket.emit('get_rooms');
      }
    },
    handleCursorMove(data) {
      if (this.socket) {
        this.socket.emit('mousemove', data);
      }
    },
    handleChangeRoom() {
      this.currentView = 'room-selector';
      this.userData = { name: '', color: '', room: '' };
      // Don't disconnect, just refresh rooms
      this.handleRefreshRooms();
    }
  },
  mounted() {
    this.initSocket();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
