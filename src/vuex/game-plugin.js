import EventEmitter from "events";

function addListenedToMap(map, listened) {
  listened.forEach((event) => {
    if (Array.isArray(event)) {
      if (event.length === 2) {
        map.set(event[0], event[1]);
      }
      else {
        addListenedToMap(map, event);
      }
    }
    else if (typeof event == "string") {
      map.set(event, event);
    }
    else if (event instanceof Map) {
      for ([k, v] of event.entries()) {
        map.set(k, v);
      }
    }
    else {
      Object.entries(event).forEach((k, v) => map.set(k, v));
    }
  });
}

export default function createPlugin(eventbus, listenedEvents, mutationCallbacks) {
  let mutationMap = new Map();
  addListenedToMap(mutationMap, listenedEvents)
  return (store) => {
    eventbus.onAny(({ event, data }) => {
      console.log(event);
      if (mutationMap.has(event)) {
        store.commit(mutationMap.get(event), ...data);
      }
    });
    if (mutationCallbacks) {
      store.subscribe((mutation) => {
        if (Object.keys(mutationCallbacks).includes(mutation.type)) {
          let cb = mutationCallbacks[mutation.type];
          if (typeof cb === "string") {
            eventbus.emit(cb, mutation.payload);
          }
          else if (typeof cb === "function") {
            cb(mutation);
          }
          else {
            console.warn(`Unknown mutation callback registered for mutation "${mutation.type}".\n\tCallback: ${cb}`);
            console.debug(mutation);
          }
        }
      });
    }
  };
}