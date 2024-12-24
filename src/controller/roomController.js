const Room = require('../model/Room');

// Obtener todas las habitaciones
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una nueva habitación
exports.createRoom = async (req, res) => {
  try {
    const { number, type, price, status } = req.body;

    const newRoom = new Room({
      number,
      type,
      price,
      status
    });

    await newRoom.save();
    res.status(201).json(newRoom);  // Envia la habitación recién creada
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar el estado de una habitación
exports.updateRoomStatus = async (req, res) => {
  try {
    console.log('ID recibido:', req.params.id);
    console.log('Estado recibido:', req.body.status);

    const { id } = req.params;
    const { status } = req.body;
    
    const room = await Room.findByIdAndUpdate(id, { status }, { new: true });
    if (!room) {
      console.error('Habitación no encontrada');
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    res.json(room);
  } catch (err) {
    console.error('Error en el servidor:', err.message);
    res.status(500).json({ error: err.message });
  }
};
