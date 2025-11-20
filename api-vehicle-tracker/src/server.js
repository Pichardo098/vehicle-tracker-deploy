require('dotenv').config();
const http = require('http');
const { initSocket } = require('./sockets/socket');
const app = require('./index');
const { db } = require('./database/config');
const initModel = require('./models/init_model');
require('./mqtt/mqtt.client');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Link Socket.io
initSocket(server);

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log(err));

initModel();

db.sync()
  .then(() => console.log('Database synced...'))
  .catch((err) => console.log(err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
