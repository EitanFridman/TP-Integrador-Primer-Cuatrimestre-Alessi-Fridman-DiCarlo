import pool from '../db.js';

export const findByUsername = async (username) => {
  const { rows } = await pool.query(
    'SELECT id, first_name, last_name, username, password FROM users WHERE username = $1',
    [username]
  );
  return rows[0];
};

export const insert = async ({ first_name, last_name, username, password }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password)
     VALUES ($1,$2,$3,$4)
     RETURNING id, first_name, last_name, username`,
    [first_name, last_name, username, password]
  );
  return rows[0];
};

