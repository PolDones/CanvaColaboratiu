export default {
  template: `
    <div class="room-selector">
      <div class="selector-container">
        <h1>Canvas Col·laboratiu</h1>
        <p class="subtitle">Uniu-vos a una sala i veieu els cursors de tots en temps real</p>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="username">El vostre nom</label>
          <input 
            id="username"
            v-model="userName" 
            type="text" 
            placeholder="Introduïu el vostre nom..."
            @keyup.enter="joinRoom"
            maxlength="20"
          >
        </div>

        <div class="form-group">
          <label for="roomname">Nom de la sala</label>
          <input 
            id="roomname"
            v-model="roomName" 
            type="text" 
            placeholder="Introduïu el nom de la sala o creeu-ne una de nova..."
            @keyup.enter="joinRoom"
            maxlength="30"
          >
        </div>

        <div v-if="availableRooms.length > 0" class="rooms-list">
          <h3>Sales disponibles</h3>
          <div 
            v-for="room in availableRooms" 
            :key="room.name"
            class="room-item" 
            :class="{ full: room.isFull }"
            @click="selectRoom(room)"
          >
            <span class="room-name">{{ room.name }}</span>
            <span class="room-info" :class="{ full: room.isFull }">
              {{ room.users }}/{{ room.maxUsers }} 
              {{ room.isFull ? '(Plena)' : '' }}
            </span>
          </div>
        </div>

        <button 
          class="btn-primary" 
          @click="joinRoom"
          :disabled="!userName.trim() || !roomName.trim()"
        >
          Entrar a la sala
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      userName: '',
      roomName: '',
      availableRooms: [],
      errorMessage: ''
    };
  },
  methods: {
    generateRandomColor() {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 70 + Math.floor(Math.random() * 20);
      const lightness = 55 + Math.floor(Math.random() * 15);
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
    selectRoom(room) {
      if (!room.isFull) {
        this.roomName = room.name;
      }
    },
    joinRoom() {
      if (!this.userName.trim() || !this.roomName.trim()) {
        this.errorMessage = 'Introduïu el vostre nom i el nom de la sala';
        return;
      }

      const color = this.generateRandomColor();
      this.$emit('join', {
        name: this.userName.trim(),
        color: color,
        room: this.roomName.trim()
      });
    },
    refreshRooms() {
      this.$emit('refresh-rooms');
    },
    setError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  },
  mounted() {
    this.refreshRooms();
    // Refresh room list every 5 seconds
    this.roomRefreshInterval = setInterval(() => {
      this.refreshRooms();
    }, 5000);
  },
  beforeUnmount() {
    if (this.roomRefreshInterval) {
      clearInterval(this.roomRefreshInterval);
    }
  }
};
