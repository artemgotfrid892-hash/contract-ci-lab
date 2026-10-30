'use strict';

const MAX_NAME_LENGTH = 100;
const MAX_CAPACITY = 1000;

function validateRoomInput(body) {
  if (typeof body.name !== 'string' || body.name.trim() === '') {
    return 'Field "name" is required and must be a non-empty string';
  }
  if (body.name.length > MAX_NAME_LENGTH) {
    return `Field "name" must be at most ${MAX_NAME_LENGTH} characters`;
  }
  if (!Number.isInteger(body.capacity) || body.capacity < 1 || body.capacity > MAX_CAPACITY) {
    return `Field "capacity" must be an integer between 1 and ${MAX_CAPACITY}`;
  }
  if (body.equipment !== undefined) {
    const isValid =
      Array.isArray(body.equipment) && body.equipment.every((item) => typeof item === 'string');
    if (!isValid) {
      return 'Field "equipment" must be an array of strings';
    }
  }
  return null;
}

function parsePositiveInt(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    return null;
  }
  const number = Number(value);
  return number >= 1 ? number : null;
}

module.exports = { validateRoomInput, parsePositiveInt };