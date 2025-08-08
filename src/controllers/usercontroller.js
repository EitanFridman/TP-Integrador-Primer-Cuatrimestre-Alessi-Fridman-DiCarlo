import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

exports.register = async (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  if (!first_name || first_name.length < 3) {
    return res.status(400).json({ message: 'Nombre inválido.' });
  }
  if (!last_name || last_name.length < 3) {
    return res.status(400).json({ message: 'Apellido inválido.' });
  }
  if (!isValidEmail(username)) {
    return res.status(400).json({ message: 'El email es inválido.' });
  }
  if (!password || password.length < 3) {
    return res.status(400).json({ message: 'Contraseña inválida.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, username, hashedPassword]
    );
    return res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!isValidEmail(username)) {
    return res.status(400).json({
      success: false,
      message: 'El email es invalido.',
      token: ''
    });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o clave inválida.',
        token: ''
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o clave inválida.',
        token: ''
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      success: true,
      message: '',
      token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor.',
      token: ''
    });
  }
};
