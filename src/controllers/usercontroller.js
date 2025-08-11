// controllers/user.controller.js
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(String(email ?? ''));

export const register = async (req, res) => {
  let { first_name, last_name, username, password } = req.body || {};
  first_name = String(first_name ?? '').trim();
  last_name  = String(last_name ?? '').trim();
  username   = String(username ?? '').trim().toLowerCase();
  password   = String(password ?? '');

  if (first_name.length < 3) return res.status(400).json({ message: 'Nombre inválido.' });
  if (last_name.length  < 3) return res.status(400).json({ message: 'Apellido inválido.' });
  if (!isValidEmail(username)) return res.status(400).json({ message: 'El email es inválido.' });
  if (password.length   < 3)  return res.status(400).json({ message: 'Contraseña inválida.' });

  try {
    const exists = await pool.query('SELECT 1 FROM users WHERE username = $1 LIMIT 1', [username]);
    if (exists.rowCount > 0) return res.status(400).json({ message: 'El usuario ya existe.' });

    const saltRounds = Number(process.env.BCRYPT_ROUNDS ?? 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const ins = `
      INSERT INTO users (first_name, last_name, username, password)
      VALUES ($1,$2,$3,$4)
      RETURNING id, first_name, last_name, username
    `;
    const { rows } = await pool.query(ins, [first_name, last_name, username, hashed]);

    return res.status(201).json({
      id: rows[0].id,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      username: rows[0].username,
      message: 'Usuario registrado correctamente.'
    });
  } catch (err) {
    if (err?.code === '23505') return res.status(400).json({ message: 'El usuario ya existe.' });
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

export const login = async (req, res) => {
  const username = String(req.body?.username ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!isValidEmail(username)) {
    return res.status(400).json({ success: false, message: 'El email es invalido.', token: '' });
  }

  try {
    const q = 'SELECT id, first_name, last_name, username, password FROM users WHERE username = $1';
    const { rows } = await pool.query(q, [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'Usuario o clave inválida.', token: '' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Usuario o clave inválida.', token: '' });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Falta JWT_SECRET en el servidor.', token: '' });
    }

    const token = jwt.sign(
      { id: user.id, first_name: user.first_name, last_name: user.last_name },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({ success: true, message: '', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor.', token: '' });
  }
};
