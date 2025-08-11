import pool from '../db.js';


export const getEvents = async (req, res) => {
  try {
    const query = 'SELECT * FROM events'; 
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener evento por ID:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const getEventsByFilters = async (req, res) => {
  try {
    const { name, startdate, tag } = req.query;

    const values = [];
    const where = [];
    let i = 1;

    // FROM base
    let fromClause = `FROM events e`;

    // Si filtra por tag, se unen tablas
    if (tag) {
      fromClause += `
        JOIN event_tags et ON et.event_id = e.id
        JOIN tags t ON t.id = et.tag_id
      `;
      values.push(`%${tag}%`);
      where.push(`t.name ILIKE $${i++}`);
    }

    if (name) {
      values.push(`%${name}%`);
      where.push(`e.name ILIKE $${i++}`);
    }

    if (startdate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startdate)) {
        return res.status(400).json({ message: 'startdate debe ser YYYY-MM-DD' });
      }
      values.push(startdate);
      where.push(`DATE(e.start_date) = $${i++}`);
    }

    const query = `
      SELECT DISTINCT e.*
      ${fromClause}
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY e.start_date ASC, e.id ASC
    `;

    const result = await pool.query(query, values);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener eventos (filtros):', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


const validateEventPayload = (p) => {
  const {
    name, description, start_date, duration_in_minutes,
    price, enabled_for_enrollment, max_assistance, id_event_location
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

const getLocationCapacity = async (id_event_location) => {
  const q = `SELECT max_capacity FROM event_locations WHERE id = $1`;
  const r = await pool.query(q, [id_event_location]);
  return r.rows[0]?.max_capacity ?? null;
};


export const createEvent = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const {
    name, description, start_date, duration_in_minutes,
    price, enabled_for_enrollment, max_assistance, id_event_location
  } = req.body;

  try {
    const errMsg = validateEventPayload(req.body);
    if (errMsg) return res.status(400).json({ message: errMsg });

    const maxCapacity = await getLocationCapacity(id_event_location);
    if (maxCapacity == null) return res.status(400).json({ message: 'id_event_location inválido.' });
    if (Number(max_assistance) > Number(maxCapacity)) {
      return res.status(400).json({ message: 'max_assistance no puede superar el max_capacity del lugar.' });
    }

    const query = `
      INSERT INTO events (
        name, description, start_date, duration_in_minutes,
        price, enabled_for_enrollment, max_assistance, id_event_location, id_creator_user
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`;
    const values = [
      name, description, start_date, duration_in_minutes,
      price, enabled_for_enrollment, max_assistance, id_event_location, userId
    ];

    const result = await pool.query(query, values);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear evento:', err);
    return res.status(500).json({ message: 'Error interno al crear evento' });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance
  } = req.body;

  try {
    const query = `
      UPDATE events SET
        name = $1,
        description = $2,
        start_date = $3,
        duration_in_minutes = $4,
        price = $5,
        enabled_for_enrollment = $6,
        max_assistance = $7
      WHERE id = $8
      RETURNING *`;

    const values = [
      name,
      description,
      start_date,
      duration_in_minutes,
      price,
      enabled_for_enrollment,
      max_assistance,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar evento:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json({ message: 'Evento eliminado con éxito' });
  } catch (err) {
    console.error('Error al eliminar evento:', err);
    res.status(500).json({ message: 'Error interno al eliminar evento' });
  }
};
