require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { getOptimalWindow } = require('./modules/temperatureSimulator');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', methods: ['GET','POST'] },
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/coffees', require('./routes/coffees'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/temperature', require('./routes/temperature'));
app.use('/api/traceability', require('./routes/traceability'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// WebSocket for real-time temperature
const tempSessions = new Map();

io.on('connection', (socket) => {
  socket.on('start_temp_tracking', (params) => {
    const startTime = Date.now();
    if (tempSessions.has(socket.id)) clearInterval(tempSessions.get(socket.id));

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const result = getOptimalWindow({ ...params, elapsedMinutes });
      socket.emit('temperature_update', { timestamp: new Date().toISOString(), elapsedMinutes: Math.round(elapsedMinutes * 10) / 10, ...result });
      if (result.status === 'frio' && elapsedMinutes > 5) {
        clearInterval(interval);
        tempSessions.delete(socket.id);
        socket.emit('temperature_ended');
      }
    }, 2000);

    tempSessions.set(socket.id, interval);
  });

  socket.on('stop_temp_tracking', () => {
    if (tempSessions.has(socket.id)) { clearInterval(tempSessions.get(socket.id)); tempSessions.delete(socket.id); }
  });

  socket.on('disconnect', () => {
    if (tempSessions.has(socket.id)) { clearInterval(tempSessions.get(socket.id)); tempSessions.delete(socket.id); }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`☕ Coffee Experience API running on port ${PORT}`));
