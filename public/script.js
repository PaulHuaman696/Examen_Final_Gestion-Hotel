const API_URL = '/api/rooms';

async function fetchRooms() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las habitaciones');
    const rooms = await response.json();

    // Obtener elementos del DOM
    const tableBody = document.querySelector('#room-table tbody');
    const roomSelector = document.getElementById('room-selector');

    // Limpiar contenido previo
    tableBody.innerHTML = '';
    roomSelector.innerHTML = '';

    // Llenar la tabla con las habitaciones
    rooms.forEach(room => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${room.number}</td>
        <td>${room.type}</td>
        <td>$${room.price}</td>
        <td>${room.status}</td>
      `;
      tableBody.appendChild(row);
    });

    // Llenar el selector de habitaciones
    roomSelector.innerHTML = rooms.map(room => `
      <option value="${room._id}">${room.number} - ${room.type} (${room.status})</option>
    `).join('');
  } catch (error) {
    console.error(error);
    const content = document.getElementById('content');
    content.innerHTML = '<p>Error cargando habitaciones.</p>';
  }
}

// Función para actualizar el estado de una habitación
async function updateRoomStatus(roomId, newStatus) {
  try {

    console.log('Actualizando habitación:', roomId, 'con estado:', newStatus);

    const url = `${API_URL}/${roomId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error('Error al actualizar el estado de la habitación');
    const result = await response.json();
    console.log('Respuesta del servidor:', result);

    alert(`El estado de la habitación ha sido cambiado a: ${newStatus}`);
    fetchRooms(); // Actualizar la tabla y el selector
  } catch (error) {
    console.error('Error en el frontend:', error.message);
    alert('Ocurrió un error al actualizar el estado.');
  }
}

async function createRoom(event) {
  event.preventDefault();

  const roomData = {
    number: document.getElementById('room-number').value,
    type: document.getElementById('room-type').value,
    price: document.getElementById('room-price').value,
    status: document.getElementById('room-status').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roomData)
    });

    if (!response.ok) throw new Error('Error al crear la habitación');
    alert('Habitación creada exitosamente');
    window.location.href = '/'; // Redirige a la página principal después de agregar la habitación
  } catch (error) {
    console.error(error);
    alert('Error al crear la habitación');
  }
}

if (document.getElementById('add-room-form')) {
  document.getElementById('add-room-form').addEventListener('submit', createRoom);
}

// Manejadores para los botones
document.getElementById('pay-button').addEventListener('click', () => {
  const selectedRoom = document.getElementById('room-selector').value;
  if (selectedRoom) updateRoomStatus(selectedRoom, 'Pagada');
  else alert('Por favor, selecciona una habitación.');
});

document.getElementById('reserve-button').addEventListener('click', () => {
  const selectedRoom = document.getElementById('room-selector').value;
  if (selectedRoom) updateRoomStatus(selectedRoom, 'Reservada');
  else alert('Por favor, selecciona una habitación.');
});

// Manejador para el botón "Volver a Disponible"
document.getElementById('available-button').addEventListener('click', () => {
  const selectedRoom = document.getElementById('room-selector').value;
  updateRoomStatus(selectedRoom, 'Disponible');
});

// Ejecutar fetchRooms al cargar la página
document.addEventListener('DOMContentLoaded', fetchRooms);
