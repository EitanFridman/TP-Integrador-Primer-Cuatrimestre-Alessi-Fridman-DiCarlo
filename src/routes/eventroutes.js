const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventcontroller');
const authenticate = require('../middlewares/auth');

// Crear un nuevo evento (requiere token)
router.post('/', authenticate, eventController.createEvent);

// Otros endpoints los vas a agregar después, por ejemplo: listar, editar, eliminar, inscribirse, etc.

module.exports = router;