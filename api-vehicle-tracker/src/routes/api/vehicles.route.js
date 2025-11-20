const express = require('express');
const router = express.Router();

// Controllers
const vehiclesController = require('../../controllers/vehicles.controller');

// Middlewares
const authMiddleware = require('../../middlewares/auth.middleware');
const validations = require('../../middlewares/validations.middleware');

// ---------- Routes ---------- //
/**
 * @swagger
 * tags: Vehículos
 * description: Endpoints relacionados con la gestión de vehículos
 */

/**
 * @swagger
 * /api/v1/vehicles:
 *   post:
 *     summary: Crear un nuevo vehículo
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - model
 *               - color
 *               - plate_number
 *               - brand
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               model:
 *                 type: string
 *                 example: Corolla
 *               color:
 *                 type: string
 *                 example: Blanco
 *               plate_number:
 *                 type: string
 *                 example: ABC123
 *               brand:
 *                 type: string
 *                 example: Toyota
 *     responses:
 *       201:
 *         description: Vehículo creado correctamente
 *       400:
 *         description: Ya existe un veichulo registrado con el mismo número de placa.
 */
router.post(
  '/',
  authMiddleware.protect,
  validations.createVehicleValidation,
  vehiclesController.createVehicle
);

/**
 * @swagger
 * /api/v1/vehicles:
 *   put:
 *     summary: Actualizar la información de un vehículo
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - model
 *               - color
 *               - plate_number
 *               - brand
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *               model:
 *                 type: string
 *                 example: Sentra
 *               color:
 *                 type: string
 *                 example: Azul
 *               plate_number:
 *                 type: string
 *                 example: XYZ987
 *               brand:
 *                 type: string
 *                 example: Nissan
 *     responses:
 *       200:
 *         description: Vehículo actualizado correctamente
 *       404:
 *         description: El vehículo no existe o está inactivo
 *       400:
 *         description: Las placas ya han sido registradas
 */
router.put(
  '/',
  authMiddleware.protect,
  validations.updateVehicleValidation,
  vehiclesController.updateVehicle
);

/**
 * @swagger
 * /api/v1/vehicles:
 *   delete:
 *     summary: Inactivar un vehículo existente
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: El vehículo ha sido inactivado
 *       404:
 *         description: El vehículo no existe.
 *       400:
 *         description: El vehículo ya se encuentra inactivo.
 */
router.delete(
  '/',
  authMiddleware.protect,
  validations.inactiveVehicleValidation,
  vehiclesController.inactiveVehicle
);

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     summary: Obtener todos los vehículos activos
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehiculos obtenidos correctamente.
 */
router.get('/', authMiddleware.protect, vehiclesController.getAllVehicles);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   get:
 *     summary: Obtener un vehículo por su ID
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo obtenido correctamente.
 *       404:
 *         description: El vehículo no existe.
 */
router.get('/:id', authMiddleware.protect, vehiclesController.getVehicleById);

module.exports = router;
