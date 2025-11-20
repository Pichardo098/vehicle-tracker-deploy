const express = require('express');
const router = express.Router();

// Controllers
const positionsController = require('../../controllers/position.controller');

// Middlewares
const authMiddleware = require('../../middlewares/auth.middleware');
const validations = require('../../middlewares/validations.middleware');

// ---------- Routes ---------- //

/**
 * @swagger
 * tags: Posiciones
 * description: Endpoints relacionados con la gestión de posiciones (coordenadas GPS) de los vehículos.
 */

/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Registrar una nueva posición (coordenada) de un vehículo.
 *     description: Permite registrar la latitud y longitud actual de un vehículo activo. Requiere autenticación.
 *     tags: [Posiciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - latitude
 *               - longitude
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *                 example: 5
 *                 description: ID del vehículo al que pertenece la posición.
 *               latitude:
 *                 type: number
 *                 example: 20.659698
 *                 description: Latitud de la posición actual.
 *               longitude:
 *                 type: number
 *                 example: -103.349609
 *                 description: Longitud de la posición actual.
 *     responses:
 *       200:
 *         description: Posición registrada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "La posición ha sido registrada exitosamente"
 *       400:
 *         description: El vehículo no existe o no se encuentra activo.
 *         content:
 *           application/json:
 *             example:
 *               message: "El vehículo no existe o no se encuentra activo."
 *       401:
 *         description: Token no válido o no proporcionado.
 */
router.post(
  '/',
  authMiddleware.protect,
  validations.createPosition,
  positionsController.createPosition
);

/**
 * @swagger
 * /positions/{id}:
 *   get:
 *     summary: Obtener las posiciones de un vehículo.
 *     description: Devuelve todas las posiciones registradas de un vehículo. Se puede solicitar el resultado en formato JSON o KML usando el parámetro `format=kml`.
 *     tags: [Posiciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del vehículo.
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: format
 *         required: false
 *         description: Si se envía con `kml`, retorna la ruta completa del vehículo en formato KML.
 *         schema:
 *           type: string
 *           example: "kml"
 *     responses:
 *       200:
 *         description: Posiciones obtenidas correctamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Posiciones obtenidas correctamente."
 *               count: 3
 *               positions:
 *                 - id: 1
 *                   vehicle_id: 5
 *                   latitude: 20.659698
 *                   longitude: -103.349609
 *                   timestamp: "2025-11-10T18:30:00.000Z"
 *                 - id: 2
 *                   vehicle_id: 5
 *                   latitude: 20.660112
 *                   longitude: -103.351021
 *                   timestamp: "2025-11-10T18:40:00.000Z"
 *       404:
 *         description: El vehículo no existe.
 *         content:
 *           application/json:
 *             example:
 *               message: "El vehicuo no existe."
 *       401:
 *         description: Token no válido o no proporcionado.
 */
router.get(
  '/:id',
  authMiddleware.protect,
  positionsController.getPositionsByVehicle
);

module.exports = router;
