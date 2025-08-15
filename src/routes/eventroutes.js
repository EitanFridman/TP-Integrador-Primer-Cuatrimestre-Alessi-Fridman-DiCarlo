import {Router} from 'express';
import * as eventController from '../controllers/eventcontroller.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.get('/:id/participants', eventController.getEventParticipants);
router.post('/', auth, eventController.createEvent);
router.post('/:id/enrollment', auth, eventController.enrollInEvent);
router.put('/', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);
router.delete('/:id/enrollment', auth, eventController.unenrollFromEvent);

export default router;