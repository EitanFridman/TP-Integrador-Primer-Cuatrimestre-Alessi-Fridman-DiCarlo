import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  listEventLocations,
  getEventLocationById,
  createEventLocation,
  updateEventLocation,
  deleteEventLocation
} from '../controllers/eventlocationcontroller.js';

const router = Router();

router.get('/', auth, listEventLocations);
router.get('/:id', auth, getEventLocationById);
router.post('/', auth, createEventLocation);
router.put('/:id', auth, updateEventLocation);
router.delete('/:id', auth, deleteEventLocation);

export default router;