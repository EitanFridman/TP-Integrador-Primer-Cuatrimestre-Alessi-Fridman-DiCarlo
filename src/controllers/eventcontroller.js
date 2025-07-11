const pool = require('../db');

exports.createEvent = async (req, res) => {
  const {
    name,
    description,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance
  } = req.body;

  const id_creator_user = req.user.id;

  // Validaciones básicas
  if (!name || name.length < 3) return res.status(400).json({ message: 'Nombre inválido' });
  if (!description || description.length < 3) return res.status(400).json({ message: 'Descripción inválida' });
  if (duration_in_minutes < 0) return res.status(400).json({ message: 'Duración inválida' });
  if (price < 0) return res.status(400).json({ message: 'Precio inválido' });

  try {
    // Verificamos la capacidad máxima del lugar
    const loc = await pool.query('SELECT max_capacity FROM event_locations WHERE id = $1', [id_event_location]);
    if (loc.rowCount === 0) return res.status(404).json({ message: 'Ubicación inexistente' });

    const max_capacity = parseInt(loc.rows[0].max_capacity);
    if (max_assistance > max_capacity) {
      return res.status(400).json({ message: 'La asistencia máxima supera la capacidad del lugar' });
    }

    // Insertamos el evento
    const insertQuery = `
      INSERT INTO events 
      (name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      name,
      description,
      id_event_location,
      start_date,
      duration_in_minutes,
      price,
      enabled_for_enrollment,
      max_assistance,
      id_creator_user
    ];

    const result = await pool.query(insertQuery, values);
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error al crear el evento:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};