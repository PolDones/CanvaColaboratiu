export default {
  template: `
    <div class="canvas-container">
      <div class="canvas-header">
        <div class="room-info-header">
          <div class="room-badge">📍 Room: {{ currentRoom }}</div>
          <div class="user-info">
            <span class="color-preview" :style="{ backgroundColor: userColor }"></span>
            <span>{{ userName }}</span>
          </div>
        </div>
        <button class="btn-change-room" @click="changeRoom">
          Change Room
        </button>
      </div>
      
      <div class="canvas-wrapper">
        <canvas 
          ref="canvas" 
          id="canvas"
          @mousemove="handleMouseMove"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        ></canvas>

        <div class="users-sidebar">
          <h3>👥 Users ({{ roomUsers.length }})</h3>
          <div v-for="user in roomUsers" :key="user.id" class="user-item">
            <div 
              class="user-color-indicator" 
              :style="{ backgroundColor: user.color }"
            ></div>
            <div class="user-name">{{ user.userName }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    userName: String,
    userColor: String,
    currentRoom: String
  },
  data() {
    return {
      cursors: new Map(),
      roomUsers: [],
      ctx: null,
      animationFrameId: null
    };
  },
  methods: {
    setupCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 60; // Account for header
      this.ctx = canvas.getContext('2d');
      
      this.startAnimation();
    },
    handleResize() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 60;
    },
    handleMouseMove(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      this.$emit('cursor-move', { x, y });
    },
    handleMouseEnter() {
      this.$refs.canvas.style.cursor = 'none';
    },
    handleMouseLeave() {
      this.$refs.canvas.style.cursor = 'default';
    },
    addCursor(data) {
      this.cursors.set(data.id, {
        x: data.x,
        y: data.y,
        userName: data.userName,
        color: data.color,
        lastUpdate: Date.now()
      });
    },
    removeCursor(id) {
      this.cursors.delete(id);
    },
    updateRoomUsers(users) {
      this.roomUsers = users;
      
      // Remove cursors of users who left
      const userIds = new Set(users.map(u => u.id));
      for (const [id] of this.cursors) {
        if (!userIds.has(id)) {
          this.cursors.delete(id);
        }
      }
    },
    drawCursor(x, y, userName, color) {
      if (!this.ctx) return;

      // Draw cursor circle
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw inner circle for depth
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.fill();

      // Draw name label
      const padding = 8;
      const fontSize = 14;
      this.ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      const textMetrics = this.ctx.measureText(userName);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      
      const labelX = x + 20;
      const labelY = y - 10;
      
      // Draw label background (rounded rectangle)
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.beginPath();
      this.roundRect(
        labelX,
        labelY - textHeight - padding,
        textWidth + padding * 2,
        textHeight + padding * 2,
        6
      );
      this.ctx.fill();
      
      // Draw border
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw text
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(userName, labelX + padding, labelY - padding);
    },
    roundRect(x, y, width, height, radius) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + radius, y);
      this.ctx.lineTo(x + width - radius, y);
      this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      this.ctx.lineTo(x + width, y + height - radius);
      this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      this.ctx.lineTo(x + radius, y + height);
      this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      this.ctx.lineTo(x, y + radius);
      this.ctx.quadraticCurveTo(x, y, x + radius, y);
      this.ctx.closePath();
    },
    render() {
      if (!this.ctx) return;
      
      const canvas = this.$refs.canvas;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw all cursors
      for (const [id, cursor] of this.cursors) {
        // Remove stale cursors (not updated in 5 seconds)
        if (Date.now() - cursor.lastUpdate > 5000) {
          this.cursors.delete(id);
          continue;
        }
        
        this.drawCursor(cursor.x, cursor.y, cursor.userName, cursor.color);
      }
    },
    startAnimation() {
      const animate = () => {
        this.render();
        this.animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    },
    stopAnimation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    },
    changeRoom() {
      this.$emit('change-room');
    }
  },
  mounted() {
    this.setupCanvas();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    this.stopAnimation();
    window.removeEventListener('resize', this.handleResize);
  }
};
