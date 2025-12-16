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
            console.log('Initializing Socket.IO connection...');
            this.socket = io('http://localhost:3000');

            this.socket.on('connect', () => {
                console.log('Socket.IO connected:', this.socket.id);
            });

            this.socket.on('joined_room', (data) => {
                console.log('Received joined_room event:', data);
                this.userData = {
                    name: data.userName,
                    color: data.color,
                    room: data.room
                };
                console.log('Switching to canvas view...');
                this.currentView = 'canvas-view';
            });

            this.socket.on('room_full', (data) => {
                const roomSelector = this.$refs.currentComponent;
                if (roomSelector && roomSelector.setError) {
                    roomSelector.setError(data.message);
                }
            });

            this.socket.on('room_users', (users) => {
                const canvas = this.$refs.currentComponent;
                if (canvas && canvas.updateRoomUsers) {
                    canvas.updateRoomUsers(users);
                }
            });

            this.socket.on('user_cursor_move', (data) => {
                const canvas = this.$refs.currentComponent;
                if (canvas && canvas.addCursor) {
                    canvas.addCursor(data);
                }
            });

            this.socket.on('rooms_list', (rooms) => {
                const roomSelector = this.$refs.currentComponent;
                if (roomSelector && roomSelector.availableRooms !== undefined) {
                    roomSelector.availableRooms = rooms;
                }
            });
        },
        handleJoin(data) {
            console.log('handleJoin called with data:', data);
            if (this.socket) {
                console.log('Emitting registerUser event...');
                this.socket.emit('registerUser', data);
            } else {
                console.error('Socket is not initialized!');
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
