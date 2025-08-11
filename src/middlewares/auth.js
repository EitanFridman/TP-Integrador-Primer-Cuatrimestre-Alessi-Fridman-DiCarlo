import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado.' });

  const [scheme, token] = authHeader.split(' ');
  if (!token || (scheme && scheme.toLowerCase() !== 'bearer')) {
    return res.status(401).json({ message: 'Token faltante o esquema inválido.' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Falta JWT_SECRET en el servidor.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, first_name, last_name, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

export default auth;