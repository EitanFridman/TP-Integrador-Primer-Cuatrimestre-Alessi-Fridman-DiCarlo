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


export const createEvent = async (req, res) => {
  const {
    name,
    description,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_event_location
  } = req.body;

  const userId = req.user?.id ?? 1;

  try {
    const query = `
      INSERT INTO events (
        name, description, start_date, duration_in_minutes,
        price, enabled_for_enrollment, max_assistance, id_event_location, id_creator_user
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`;

    const values = [
      name,
      description,
      start_date,
      duration_in_minutes,
      price,
      enabled_for_enrollment,
      max_assistance,
      id_event_location,
      userId
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear evento:', err);
    res.status(500).json({ message: 'Error interno al crear evento' });
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
