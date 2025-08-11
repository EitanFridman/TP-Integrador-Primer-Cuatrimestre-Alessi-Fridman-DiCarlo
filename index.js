import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/usersroutes.js';
import eventRoutes from './src/routes/eventroutes.js';
import eventLocationRoutes from './src/routes/eventlocationroutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/event-location', eventLocationRoutes);

app.get('/', (_req, res) => res.send('API de Eventos funcionando'));


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


export default app;
