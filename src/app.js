const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/user', require('./routes/usersroutes'));
app.use('/api/event', require('./routes/eventroutes'));



app.get('/', (req, res) => {
  res.send('API de Eventos funcionando');
});

module.exports = app;
