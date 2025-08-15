import * as eventRepo from '../repositories/eventRepository.js';

const validateEventPayload = (p) => {
  const {
    name,
    description,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_event_location
  } = p;

  if (!name || name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (!description || description.trim().length < 3) return 'La descripción debe tener al menos 3 caracteres.';
  if (price < 0) return 'El precio no puede ser negativo.';
  if (duration_in_minutes < 0) return 'La duración no puede ser negativa.';
  if (!id_event_location) return 'Falta id_event_location.';
  if (!start_date) return 'Falta start_date.';
  if (typeof enabled_for_enrollment !== 'boolean') return 'enabled_for_enrollment debe ser boolean.';
  if (max_assistance == null) return 'Falta max_assistance.';
  return null;
};

export const listEvents = async (filters = {}) => {
  return eventRepo.findWithFilters(filters);
};

export const getEventById = async (id) => {
  const event = await eventRepo.findById(id);
  if (!event) {
    const err = new Error('Evento no encontrado');
    err.status = 404;
    throw err;
  }
  return event;
};

export const createEvent = async (userId, data) => {
  const errMsg = validateEventPayload(data);
  if (errMsg) {
    const err = new Error(errMsg);
    err.status = 400;
    throw err;
  }

  const maxCapacity = await eventRepo.getLocationCapacity(data.id_event_location);
  if (maxCapacity == null) {
    const err = new Error('id_event_location inválido.');
    err.status = 400;
    throw err;
  }
  if (Number(data.max_assistance) > Number(maxCapacity)) {
    const err = new Error('max_assistance no puede superar el max_capacity del lugar.');
    err.status = 400;
    throw err;
  }

  const payload = { ...data, id_creator_user: userId };
  return eventRepo.insert(payload);
};

export const updateEvent = async (userId, data) => {
  const existing = await eventRepo.findById(data.id);
  if (!existing || existing.id_creator_user !== userId) {
    const err = new Error('Evento no encontrado o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }

  const payload = {
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    start_date: data.start_date ?? existing.start_date,
    duration_in_minutes: data.duration_in_minutes ?? existing.duration_in_minutes,
    price: data.price ?? existing.price,
    enabled_for_enrollment: typeof data.enabled_for_enrollment === 'boolean'
      ? data.enabled_for_enrollment
      : existing.enabled_for_enrollment,
    max_assistance: data.max_assistance ?? existing.max_assistance,
    id_event_location: data.id_event_location ?? existing.id_event_location,
  };

  const errMsg = validateEventPayload(payload);
  if (errMsg) {
    const err = new Error(errMsg);
    err.status = 400;
    throw err;
  }

  const maxCapacity = await eventRepo.getLocationCapacity(payload.id_event_location);
  if (maxCapacity == null) {
    const err = new Error('id_event_location inválido.');
    err.status = 400;
    throw err;
  }
  if (Number(payload.max_assistance) > Number(maxCapacity)) {
    const err = new Error('max_assistance no puede superar el max_capacity del lugar.');
    err.status = 400;
    throw err;
  }

  const updated = await eventRepo.update(data.id, userId, payload);
  if (!updated) {
    const err = new Error('Evento no encontrado o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }
  return updated;
};

export const deleteEvent = async (userId, id) => {
  const existing = await eventRepo.findById(id);
  if (!existing || existing.id_creator_user !== userId) {
    const err = new Error('Evento no encontrado o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }

  const hasReg = await eventRepo.hasEnrollments(id);
  if (hasReg) {
    const err = new Error('No se puede eliminar: hay usuarios inscriptos al evento.');
    err.status = 400;
    throw err;
  }

  const deleted = await eventRepo.remove(id, userId);
  if (!deleted) {
    const err = new Error('Evento no encontrado o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }
  return deleted;
};
