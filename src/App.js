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
            console.log('Inicialitzant connexió Socket.IO...');
            this.socket = io('http://localhost:3000');

            this.socket.on('connect', () => {
                console.log('Socket.IO connectat:', this.socket.id);
            });

            this.socket.on('joined_room', (data) => {
                console.log('Rebut event joined_room:', data);
                this.userData = {
                    name: data.userName,
                    color: data.color,
                    room: data.room
                };
                console.log('Canviant a vista de Canvas...');
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
            console.log('handleJoin cridat amb dades:', data);
            if (this.socket) {
                console.log('Emetent event registerUser...');
                this.socket.emit('registerUser', data);
            } else {
                console.error('Socket no està inicialitzat!');
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
