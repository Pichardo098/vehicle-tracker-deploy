const express = require('express');
const router = express.Router();

// Controllers
const userControllers = require('../../controllers/user.controller');

// Middlewares
const authMiddleware = require('../../middlewares/auth.middleware');
const validations = require('../../middlewares/validations.middleware');

// ---------- Routes ---------- //
/**
 * @swagger
 * tags: Usuarios
 * description: Endpoints relacionados con la gestión de usuarios
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - firstLastName
 *               - secondLastName
 *               - email
 *               - password
 *               - admin
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Antonio"
 *               firstLastName:
 *                 type: string
 *                 example: "Pichardo"
 *               secondLastName:
 *                 type: string
 *                 example: "Ríos"
 *               email:
 *                 type: string
 *                 example: "antonio@mail.com"
 *               password:
 *                 type: string
 *                 example: "Spore123!"
 *               admin:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/register',
  validations.createUserValidation,
  userControllers.createUser
);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Cambia la contraseña del usuario actual
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "Spore123!"
 *               newPassword:
 *                 type: string
 *                 example: "Spore456!"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Las contraseñas no deben ser iguales o son inválidas
 *       401:
 *         description: Token inválido o no autorizado
 */
router.put(
  '/change-password',
  authMiddleware.protect,
  validations.changePassword,
  userControllers.changePassword
);

/**
 * @swagger
 * /users/auth:
 *   post:
 *     summary: Inicia sesión con correo y contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "antonio@mail.com"
 *               password:
 *                 type: string
 *                 example: "Spore123!"
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       400:
 *         description: Credenciales incorrectas o faltantes
 */
router.post('/auth', validations.loginUser, userControllers.loginUser);

/**
 * @swagger
 * /users/{id}:
 *    get:
 *      summary: Obtener todos los usuarios activos
 *      tags: [Usuarios]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Usuarios obtenidos con éxito.
 */
router.get('/', authMiddleware.protect, userControllers.getAllUsers);

module.exports = router;
