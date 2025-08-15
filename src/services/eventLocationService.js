import * as repo from '../repositories/eventLocationRepository.js';

const validatePayload = ({ name, full_address, id_location, max_capacity }) => {
  if (!name || name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (!full_address || full_address.trim().length < 3) return 'La dirección debe tener al menos 3 caracteres.';
  if (!id_location) return 'Falta id_location.';
  if (!Number.isFinite(Number(max_capacity)) || Number(max_capacity) <= 0) {
    return 'max_capacity debe ser un número mayor a 0.';
  }
  return null;
};

export const listEventLocations = async (userId, { page = 1, size = 10 } = {}) => {
  const p = Math.max(1, parseInt(page, 10));
  const s = Math.max(1, Math.min(100, parseInt(size, 10)));
  const offset = (p - 1) * s;

  const total = await repo.countByUser(userId);
  const data = await repo.findAllByUser(userId, s, offset);
  return { page: p, size: s, total, data };
};

export const getEventLocationById = async (userId, id) => {
  const loc = await repo.findById(id, userId);
  if (!loc) {
    const err = new Error('Event-location no encontrada o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }
  return loc;
};

export const createEventLocation = async (userId, data) => {
  const errMsg = validatePayload(data);
  if (errMsg) {
    const err = new Error(errMsg);
    err.status = 400;
    throw err;
  }

  const exists = await repo.locationExists(data.id_location);
  if (!exists) {
    const err = new Error('id_location inexistente.');
    err.status = 400;
    throw err;
  }

  return repo.insert({ ...data, id_creator_user: userId });
};

export const updateEventLocation = async (userId, id, data) => {
  const existing = await repo.findById(id, userId);
  if (!existing) {
    const err = new Error('Event-location no encontrada o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }

  const toValidate = {
    name: data.name ?? existing.name,
    full_address: data.full_address ?? existing.full_address,
    id_location: data.id_location ?? existing.id_location,
    max_capacity: data.max_capacity ?? existing.max_capacity,
  };

  const errMsg = validatePayload(toValidate);
  if (errMsg) {
    const err = new Error(errMsg);
    err.status = 400;
    throw err;
  }

  if (data.id_location && data.id_location !== existing.id_location) {
    const exists = await repo.locationExists(data.id_location);
    if (!exists) {
      const err = new Error('id_location inexistente.');
      err.status = 400;
      throw err;
    }
  }

  const updated = await repo.update(id, userId, toValidate);
  if (!updated) {
    const err = new Error('Event-location no encontrada o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }
  return updated;
};

export const deleteEventLocation = async (userId, id) => {
  const has = await repo.hasEvents(id);
  if (has) {
    const err = new Error('No se puede eliminar: existen eventos usando esta ubicación.');
    err.status = 400;
    throw err;
  }

  const deleted = await repo.remove(id, userId);
  if (!deleted) {
    const err = new Error('Event-location no encontrada o no pertenece al usuario.');
    err.status = 404;
    throw err;
  }
  return deleted;
};

