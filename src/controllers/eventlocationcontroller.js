// controllers/eventLocation.controller.js
import pool from '../db.js';

// Helpers
const validatePayload = ({ name, full_address, id_location, max_capacity }) => {
  if (!name || name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (!full_address || full_address.trim().length < 3) return 'La dirección debe tener al menos 3 caracteres.';
  if (!id_location) return 'Falta id_location.';
  if (!Number.isFinite(Number(max_capacity)) || Number(max_capacity) <= 0) {
    return 'max_capacity debe ser un número mayor a 0.';
  }
  return null;
};

const locationExists = async (id_location) => {
  const q = 'SELECT 1 FROM locations WHERE id = $1';
  const r = await pool.query(q, [id_location]);
  return r.rowCount > 0;
};

// GET /api/event-location?page=&size=
export const listEventLocations = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const page = Math.max(1, parseInt(req.query.page ?? '1', 10));
  const size = Math.max(1, Math.min(100, parseInt(req.query.size ?? '10', 10)));
  const offset = (page - 1) * size;

  try {
    const countQ = 'SELECT COUNT(*)::int AS total FROM event_locations WHERE id_creator_user = $1';
    const { rows: cRows } = await pool.query(countQ, [userId]);
    const total = cRows[0]?.total ?? 0;

    const dataQ = `
      SELECT id, name, full_address, id_location, max_capacity, id_creator_user
      FROM event_locations
      WHERE id_creator_user = $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(dataQ, [userId, size, offset]);

    return res.status(200).json({ page, size, total, data: rows });
  } catch (err) {
    console.error('List event-locations error:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

// GET /api/event-location/:id
export const getEventLocationById = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const { id } = req.params;
  try {
    const q = `
      SELECT id, name, full_address, id_location, max_capacity, id_creator_user
      FROM event_locations
      WHERE id = $1 AND id_creator_user = $2
    `;
    const { rows } = await pool.query(q, [id, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event-location no encontrada o no pertenece al usuario.' });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Get event-location error:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

// POST /api/event-location
export const createEventLocation = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const { name, full_address, id_location, max_capacity } = req.body ?? {};
  try {
    const err = validatePayload({ name, full_address, id_location, max_capacity });
    if (err) return res.status(400).json({ message: err });

    const locOk = await locationExists(id_location);
    if (!locOk) return res.status(400).json({ message: 'id_location inexistente.' });

    const ins = `
      INSERT INTO event_locations (name, full_address, id_location, max_capacity, id_creator_user)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id, name, full_address, id_location, max_capacity, id_creator_user
    `;
    const { rows } = await pool.query(ins, [name.trim(), full_address.trim(), id_location, max_capacity, userId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create event-location error:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

// PUT /api/event-location/:id
export const updateEventLocation = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const { id } = req.params;
  const { name, full_address, id_location, max_capacity } = req.body ?? {};

  try {
    // Traigo existente para ownership y defaults
    const getQ = `
      SELECT id, name, full_address, id_location, max_capacity, id_creator_user
      FROM event_locations
      WHERE id = $1 AND id_creator_user = $2
    `;
    const { rows: exRows } = await pool.query(getQ, [id, userId]);
    if (exRows.length === 0) {
      return res.status(404).json({ message: 'Event-location no encontrada o no pertenece al usuario.' });
    }
    const existing = exRows[0];

    const toValidate = {
      name: (name ?? existing.name),
      full_address: (full_address ?? existing.full_address),
      id_location: (id_location ?? existing.id_location),
      max_capacity: (max_capacity ?? existing.max_capacity)
    };

    const err = validatePayload(toValidate);
    if (err) return res.status(400).json({ message: err });

    if (id_location && id_location !== existing.id_location) {
      const locOk = await locationExists(id_location);
      if (!locOk) return res.status(400).json({ message: 'id_location inexistente.' });
    }

    const upd = `
      UPDATE event_locations SET
        name = $1,
        full_address = $2,
        id_location = $3,
        max_capacity = $4
      WHERE id = $5 AND id_creator_user = $6
      RETURNING id, name, full_address, id_location, max_capacity, id_creator_user
    `;
    const { rows } = await pool.query(upd, [
      toValidate.name.trim(),
      toValidate.full_address.trim(),
      toValidate.id_location,
      toValidate.max_capacity,
      id,
      userId
    ]);

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Update event-location error:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

// DELETE /api/event-location/:id
export const deleteEventLocation = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const { id } = req.params;
  try {
    // (Opcional) impedir borrar si hay eventos que referencian esta location
    const refQ = 'SELECT 1 FROM events WHERE id_event_location = $1 LIMIT 1';
    const { rows: refRows } = await pool.query(refQ, [id]);
    if (refRows.length > 0) {
      return res.status(400).json({ message: 'No se puede eliminar: existen eventos usando esta ubicación.' });
    }

    const del = `
      DELETE FROM event_locations
      WHERE id = $1 AND id_creator_user = $2
      RETURNING id, name, full_address, id_location, max_capacity, id_creator_user
    `;
    const { rows } = await pool.query(del, [id, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event-location no encontrada o no pertenece al usuario.' });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Delete event-location error:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};
