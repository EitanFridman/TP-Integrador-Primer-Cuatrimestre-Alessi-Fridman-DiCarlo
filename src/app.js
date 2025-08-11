import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userroutes.js';
import eventRoutes from './routes/eventroutes.js';
import eventLocationRoutes from './routes/eventlocationroutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/event-location', eventLocationRoutes);

app.get('/', (_req, res) => res.send('API de Eventos funcionando'));
export default app;