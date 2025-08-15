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
  // Extraer parámetros de paginación
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  
  // Validar parámetros de paginación
  if (page < 1) {
    const err = new Error('La página debe ser mayor a 0');
    err.status = 400;
    throw err;
  }
  
  if (limit < 1 || limit > 100) {
    const err = new Error('El límite debe estar entre 1 y 100');
    err.status = 400;
    throw err;
  }
  
  return eventRepo.findWithFilters({ ...filters, page, limit });
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

// Nuevas funciones para inscripciones
export const enrollInEvent = async (userId, eventId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) {
    const err = new Error('Evento no encontrado');
    err.status = 404;
    throw err;
  }

  // Verificar si el evento está habilitado para inscripción
  if (!event.enabled_for_enrollment) {
    const err = new Error('El evento no está habilitado para inscripción');
    err.status = 400;
    throw err;
  }

  // Verificar si el evento ya pasó o es hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.start_date);
  eventDate.setHours(0, 0, 0, 0);
  
  if (eventDate <= today) {
    const err = new Error('No se puede inscribir a un evento que ya pasó o es hoy');
    err.status = 400;
    throw err;
  }

  // Verificar si ya está inscripto
  const isEnrolled = await eventRepo.isUserEnrolled(userId, eventId);
  if (isEnrolled) {
    const err = new Error('Ya estás inscripto a este evento');
    err.status = 400;
    throw err;
  }

  // Verificar capacidad
  const currentEnrollments = await eventRepo.getEnrollmentCount(eventId);
  if (currentEnrollments >= event.max_assistance) {
    const err = new Error('El evento ha alcanzado su capacidad máxima');
    err.status = 400;
    throw err;
  }

  return eventRepo.enrollUser(userId, eventId);
};

export const unenrollFromEvent = async (userId, eventId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) {
    const err = new Error('Evento no encontrado');
    err.status = 404;
    throw err;
  }

  // Verificar si el evento ya pasó o es hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.start_date);
  eventDate.setHours(0, 0, 0, 0);
  
  if (eventDate <= today) {
    const err = new Error('No se puede cancelar inscripción a un evento que ya pasó o es hoy');
    err.status = 400;
    throw err;
  }

  // Verificar si está inscripto
  const isEnrolled = await eventRepo.isUserEnrolled(userId, eventId);
  if (!isEnrolled) {
    const err = new Error('No estás inscripto a este evento');
    err.status = 400;
    throw err;
  }

  return eventRepo.unenrollUser(userId, eventId);
};

export const getEventParticipants = async (eventId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) {
    const err = new Error('Evento no encontrado');
    err.status = 404;
    throw err;
  }

  return eventRepo.getEventParticipants(eventId);
};
