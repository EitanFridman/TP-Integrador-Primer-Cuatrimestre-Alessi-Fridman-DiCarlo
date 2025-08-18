import pool from '../db.js';

export const findWithFilters = async ({ name, startdate, tag } = {}) => {
  const values = [];
  const where = [];
  let i = 1;

  let fromClause = 'FROM events e';

  if (tag) {
    fromClause += `
      JOIN event_tags et ON et.id_event = e.id
      JOIN tags t ON t.id = et.id_tag
    `;
    values.push(`%${tag}%`);
    where.push(`t.name ILIKE $${i++}`);
  }

  if (name) {
    values.push(`%${name}%`);
    where.push(`e.name ILIKE $${i++}`);
  }

  if (startdate) {
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
  return result.rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
  return rows[0];
};

export const insert = async (event) => {
  const {
    name,
    description,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_event_location,
    id_creator_user
  } = event;
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
    id_creator_user
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const update = async (id, userId, payload) => {
  const query = `
    UPDATE events SET
      name = $1,
      description = $2,
      start_date = $3,
      duration_in_minutes = $4,
      price = $5,
      enabled_for_enrollment = $6,
      max_assistance = $7,
      id_event_location = $8
    WHERE id = $9 AND id_creator_user = $10
    RETURNING *`;
  const values = [
    payload.name,
    payload.description,
    payload.start_date,
    payload.duration_in_minutes,
    payload.price,
    payload.enabled_for_enrollment,
    payload.max_assistance,
    payload.id_event_location,
    id,
    userId
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const remove = async (id, userId) => {
  const { rows } = await pool.query(
    'DELETE FROM events WHERE id = $1 AND id_creator_user = $2 RETURNING *',
    [id, userId]
  );
  return rows[0];
};

export const getLocationCapacity = async (id_event_location) => {
  const { rows } = await pool.query(
    'SELECT max_capacity FROM event_locations WHERE id = $1',
    [id_event_location]
  );
  return rows[0]?.max_capacity ?? null;
};

export const hasEnrollments = async (eventId) => {
  const { rowCount } = await pool.query(
    'SELECT 1 FROM event_enrollments WHERE id_event = $1 LIMIT 1',
    [eventId]
  );
  return rowCount > 0;
};

