import { Priority } from '@checkup/core';

export default class PriorityMap<K, V> {
  maps: Map<any, Map<K, V>>;

  constructor() {
    this.maps = new Map<Priority, Map<K, V>>([
      [Priority.High, new Map<K, V>()],
      [Priority.Medium, new Map<K, V>()],
      [Priority.Low, new Map<K, V>()],
    ]);
  }

  get(priority: Priority, key: K) {
    let map = this.maps.get(priority);

    return map!.get(key);
  }

  set(priority: Priority, key: K, value: V) {
    let map = this.maps.get(priority);

    map!.set(key, value);
  }

  *interator() {
    for (let [, map] of this.maps) {
      for (let [, task] of map) {
        yield task;
      }
    }
  }

  [Symbol.iterator]() {
    return this.interator();
  }
}
