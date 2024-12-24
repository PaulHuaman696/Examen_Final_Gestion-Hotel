const express = require('express');
const router = express.Router();
const roomController = require('../controller/roomController');

router.get('/', roomController.getAllRooms);
router.post('/', roomController.createRoom);
router.patch('/:id', roomController.updateRoomStatus);

module.exports = router;
