import * as eventService from '../services/eventService.js';

export const getEvents = async (req, res) => {
  try {
    const events = await eventService.listEvents(req.query);
    res.status(200).json(events);
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json(event);
  } catch (err) {
    console.error('Error al obtener evento por ID:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
  }
};

export const createEvent = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const created = await eventService.createEvent(userId, req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error al crear evento:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno al crear evento' });
  }
};

export const updateEvent = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const updated = await eventService.updateEvent(userId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error al actualizar evento:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
  }
};

export const deleteEvent = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  try {
    const deleted = await eventService.deleteEvent(userId, req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    console.error('Error al eliminar evento:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno al eliminar evento' });
  }
};

