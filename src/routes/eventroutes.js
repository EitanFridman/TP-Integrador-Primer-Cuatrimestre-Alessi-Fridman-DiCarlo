const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventcontroller');
const authenticate = require('../middlewares/auth');


router.post('/', authenticate, eventController.createEvent);

router.get('/api/events', eventController.listEvents);



module.exports = router;