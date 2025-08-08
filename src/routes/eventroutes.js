import {Router} from 'express';
import * as eventController from '../controllers/eventcontroller.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', auth, eventController.createEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);



export default router;