// Import component definitions
import RoomSelector from '/src/components/RoomSelector.js';
import CanvasView from '/src/components/Canvas.js';
import AppComponent from '/src/App.js';

const { createApp } = Vue;

const app = createApp(AppComponent);

// Register components
app.component('room-selector', RoomSelector);
app.component('canvas-view', CanvasView);

app.mount('#app');
