import * as service from '../services/eventLocationService.js';

export const listEventLocations = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const result = await service.listEventLocations(userId, req.query);
    res.status(200).json(result);
  } catch (err) {
    console.error('List event-locations error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error del servidor.' });
  }
};

export const getEventLocationById = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const data = await service.getEventLocationById(userId, req.params.id);
    res.status(200).json(data);
  } catch (err) {
    console.error('Get event-location error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error del servidor.' });
  }
};

export const createEventLocation = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const created = await service.createEventLocation(userId, req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error('Create event-location error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error del servidor.' });
  }
};

export const updateEventLocation = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const updated = await service.updateEventLocation(userId, req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Update event-location error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error del servidor.' });
  }
};

export const deleteEventLocation = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const deleted = await service.deleteEventLocation(userId, req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    console.error('Delete event-location error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error del servidor.' });
  }
};

