'use strict';

const express = require('express');
const { RoomStore } = require('./store');
const { validateRoomInput, parsePositiveInt } = require('./validation');

const SEED_ROOMS = [
  { name: 'A-101', capacity: 30, equipment: ['projector'] },
  { name: 'B-205', capacity: 120, equipment: ['projector', 'microphone'] },
];

function errorBody(code, message) {
  return { code, message };
}

function createApp(store = new RoomStore(SEED_ROOMS)) {
  const app = express();
  app.use(express.json());

  app.get('/rooms', (req, res) => {
    let minCapacity;
    if (req.query.minCapacity !== undefined) {
      minCapacity = parsePositiveInt(req.query.minCapacity);
      if (minCapacity === null) {
        return res
          .status(400)
          .json(errorBody('VALIDATION_ERROR', 'Query "minCapacity" must be a positive integer'));
      }
    }
    return res.status(200).json(store.list(minCapacity));
  });

  app.post('/rooms', (req, res) => {
    const body = req.body ?? {};
    const error = validateRoomInput(body);
    if (error) {
      return res.status(400).json(errorBody('VALIDATION_ERROR', error));
    }
    if (store.findByName(body.name)) {
      return res
        .status(409)
        .json(errorBody('CONFLICT', `Room "${body.name}" already exists`));
    }
    const room = store.create(body);
    return res.status(201).location(`/rooms/${room.id}`).json(room);
  });

  app.get('/rooms/:roomId', (req, res) => {
    const id = parsePositiveInt(req.params.roomId);
    if (id === null) {
      return res
        .status(400)
        .json(errorBody('VALIDATION_ERROR', 'Path "roomId" must be a positive integer'));
    }
    const room = store.get(id);
    if (!room) {
      return res.status(404).json(errorBody('NOT_FOUND', `Room ${id} not found`));
    }
    return res.status(200).json(room);
  });

  app.delete('/rooms/:roomId', (req, res) => {
    const id = parsePositiveInt(req.params.roomId);
    if (id === null) {
      return res
        .status(400)
        .json(errorBody('VALIDATION_ERROR', 'Path "roomId" must be a positive integer'));
    }
    if (!store.delete(id)) {
      return res.status(404).json(errorBody('NOT_FOUND', `Room ${id} not found`));
    }
    return res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json(errorBody('NOT_FOUND', 'Route not found'));
  });

  // Обработчик ошибок (например, некорректный JSON в теле запроса)
  app.use((err, req, res, _next) => {
    const status = err.status && err.status < 500 ? err.status : 500;
    const code = status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR';
    res.status(status).json(errorBody(code, status === 400 ? 'Malformed request' : 'Internal error'));
  });

  return app;
}

module.exports = { createApp, SEED_ROOMS };