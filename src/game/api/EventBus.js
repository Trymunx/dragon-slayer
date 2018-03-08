import * as EventEmitter from "events"

export const ListenToAll = Symbol("Listening to all events")

export function wrap(eventemitter) {
  let do_emit = eventemitter.emit;
  eventemitter.emit = (event, ...data) => {
    do_emit(event, ...data);
    do_emit(ListenToAll, ...data);
  }
  eventemitter.onAny = function(listener) {
    eventemitter.on(ListenToAll);
  }
  return eventemitter;
}

/**
 * Adds support for listening to all events emitted.
 * Use `onAny()` to listen to all events.
 * @constructor
 * @extends EventEmitter
 */
export default
class EventBus extends EventEmitter {
  emit(event, ...data) {
    super.emit(event, ...data);
    super.emit(ListenToAll, {event, data});
  }
  /**
   * @param listener a function recieving an argument in the form:
   *
   * ```{event: <event-emitted>, data: <args-passed-to-emit>}```
   */
  onAny(listener) {
    this.on(ListenToAll, listener);
  }
}
