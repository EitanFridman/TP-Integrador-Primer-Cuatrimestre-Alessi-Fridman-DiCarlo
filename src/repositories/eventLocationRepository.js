import pool from '../db.js';

export const countByUser = async (userId) => {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM event_locations WHERE id_creator_user = $1',
    [userId]
  );
  return rows[0]?.total ?? 0;
};

export const findAllByUser = async (userId, limit, offset) => {
  const { rows } = await pool.query(
    `SELECT id, name, full_address, id_location, max_capacity, id_creator_user
     FROM event_locations
     WHERE id_creator_user = $1
     ORDER BY id DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return rows;
};

export const findById = async (id, userId) => {
  const { rows } = await pool.query(
    `SELECT id, name, full_address, id_location, max_capacity, id_creator_user
     FROM event_locations
     WHERE id = $1 AND id_creator_user = $2`,
    [id, userId]
  );
  return rows[0];
};

export const insert = async ({ name, full_address, id_location, max_capacity, id_creator_user }) => {
  const { rows } = await pool.query(
    `INSERT INTO event_locations (name, full_address, id_location, max_capacity, id_creator_user)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, name, full_address, id_location, max_capacity, id_creator_user`,
    [name, full_address, id_location, max_capacity, id_creator_user]
  );
  return rows[0];
};

export const update = async (id, userId, { name, full_address, id_location, max_capacity }) => {
  const { rows } = await pool.query(
    `UPDATE event_locations SET
       name = $1,
       full_address = $2,
       id_location = $3,
       max_capacity = $4
     WHERE id = $5 AND id_creator_user = $6
     RETURNING id, name, full_address, id_location, max_capacity, id_creator_user`,
    [name, full_address, id_location, max_capacity, id, userId]
  );
  return rows[0];
};

export const remove = async (id, userId) => {
  const { rows } = await pool.query(
    `DELETE FROM event_locations
     WHERE id = $1 AND id_creator_user = $2
     RETURNING id, name, full_address, id_location, max_capacity, id_creator_user`,
    [id, userId]
  );
  return rows[0];
};

export const locationExists = async (id_location) => {
  const { rowCount } = await pool.query('SELECT 1 FROM locations WHERE id = $1', [id_location]);
  return rowCount > 0;
};

export const hasEvents = async (id) => {
  const { rowCount } = await pool.query(
    'SELECT 1 FROM events WHERE id_event_location = $1 LIMIT 1',
    [id]
  );
  return rowCount > 0;
};

