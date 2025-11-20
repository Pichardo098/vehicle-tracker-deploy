require('dotenv').config();
const mqtt = require('mqtt');
const { Positions } = require('../models/positions.model');
const { Vehicles } = require('../models/vehicles.model');
const { getIO } = require('../sockets/socket');

const MQTT_BROKER_URL =
  process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org';

const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
  console.log(`✅ Connected to MQTT broker: ${MQTT_BROKER_URL}`);
  client.subscribe('vehicle/+/positions');
});

client.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { vehicle_id, latitude, longitude } = data;

    const vehicle = await Vehicles.findOne({
      where: { id: vehicle_id, active: true },
    });
    if (!vehicle) return;

    const newPosition = await Positions.create({
      vehicle_id,
      latitude,
      longitude,
      timestamp: new Date(),
    });

    console.log(`💾 Position saved for vehicle ${vehicle_id}`);

    // Emitir al room correspondiente
    const io = getIO();
    io.to(`vehicle:${vehicle_id}`).emit('vehicle:update', {
      vehicle_id,
      latitude,
      longitude,
      timestamp: newPosition.timestamp,
    });

    console.log(`📤 Emitido vehicle:update para vehicle:${vehicle_id}`);
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

module.exports = client;
