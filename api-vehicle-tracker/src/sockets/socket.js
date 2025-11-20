// sockets/socket.js
const { Server } = require('socket.io');

let ioInstance = null;

function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*', // 🔧 En producción, específica tu dominio
      methods: ['GET', 'POST'],
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);

    socket.on('join:vehicle', (vehicleId) => {
      const room = `vehicle:${vehicleId}`;
      socket.join(room);
      console.log(`✅ Socket ${socket.id} joined room ${room}`);
    });

    // 🆕 Manejar leave
    socket.on('leave:vehicle', (vehicleId) => {
      const room = `vehicle:${vehicleId}`;
      socket.leave(room);
      console.log(`👋 Socket ${socket.id} left room ${room}`);
    });

    socket.on('update:coordinates', (data) => {
      const { vehicleId, latitude, longitude } = data;
      console.log(`📡 Coordenadas recibidas de front:`, data);

      // 🔧 Emitir a TODOS en el room (incluyendo al emisor)
      ioInstance.to(`vehicle:${vehicleId}`).emit('vehicle:update', {
        vehicle_id: vehicleId,
        latitude,
        longitude,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado:', socket.id);
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error('❗ Socket.IO no ha sido inicializado aún.');
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };
