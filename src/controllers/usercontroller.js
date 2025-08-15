import * as userService from '../services/userService.js';

export const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ ...user, message: 'Usuario registrado correctamente.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Error del servidor.' });
  }
};

export const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Login error:', err);
    res.status(err.status || 500).json({ success: false, message: err.message, token: '' });
  }
};

