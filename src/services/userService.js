import * as userRepo from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(String(email ?? ''));

export const register = async (data) => {
  let { first_name, last_name, username, password } = data || {};
  first_name = String(first_name ?? '').trim();
  last_name = String(last_name ?? '').trim();
  username = String(username ?? '').trim().toLowerCase();
  password = String(password ?? '');

  if (first_name.length < 3) {
    const err = new Error('Nombre inválido.');
    err.status = 400;
    throw err;
  }
  if (last_name.length < 3) {
    const err = new Error('Apellido inválido.');
    err.status = 400;
    throw err;
  }
  if (!isValidEmail(username)) {
    const err = new Error('El email es inválido.');
    err.status = 400;
    throw err;
  }
  if (password.length < 3) {
    const err = new Error('Contraseña inválida.');
    err.status = 400;
    throw err;
  }

  const exists = await userRepo.findByUsername(username);
  if (exists) {
    const err = new Error('El usuario ya existe.');
    err.status = 400;
    throw err;
  }

  const saltRounds = Number(process.env.BCRYPT_ROUNDS ?? 10);
  const hashed = await bcrypt.hash(password, saltRounds);

  return userRepo.insert({ first_name, last_name, username, password: hashed });
};

export const login = async ({ username, password }) => {
  username = String(username ?? '').trim().toLowerCase();
  password = String(password ?? '');

  if (!isValidEmail(username)) {
    const err = new Error('El email es invalido.');
    err.status = 400;
    throw err;
  }

  const user = await userRepo.findByUsername(username);
  if (!user) {
    const err = new Error('Usuario o clave inválida.');
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Usuario o clave inválida.');
    err.status = 401;
    throw err;
  }

  if (!process.env.JWT_SECRET) {
    const err = new Error('Falta JWT_SECRET en el servidor.');
    err.status = 500;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, first_name: user.first_name, last_name: user.last_name },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { success: true, message: '', token };
};

