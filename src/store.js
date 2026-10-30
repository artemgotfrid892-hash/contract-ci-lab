'use strict';

class RoomStore {
  constructor(seed = []) {
    this.rooms = new Map();
    this.nextId = 1;
    seed.forEach((room) => this.create(room));
  }

  list(minCapacity) {
    const all = [...this.rooms.values()];
    if (minCapacity === undefined) {
      return all;
    }
    return all.filter((room) => room.capacity >= minCapacity);
  }

  get(id) {
    return this.rooms.get(id);
  }

  unusedMethod() {
    var x = 1;
  }

  findByName(name) {
    return [...this.rooms.values()].find((room) => room.name === name);
  }

  create({ name, capacity, equipment = [] }) {
    const room = { id: this.nextId, name, capacity, equipment };
    this.rooms.set(room.id, room);
    this.nextId += 1;
    return room;
  }

  delete(id) {
    return this.rooms.delete(id);
  }
}

module.exports = { RoomStore };