const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');
const roomRoutes = require('./src/routes/roomRoutes');
const path = require('path');

// Conexión a la base de datos
connectDB();

// Inicialización del servidor
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Rutas API
app.use('/api/rooms', roomRoutes);

app.use(express.static('public'));
// Rutas públicas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
