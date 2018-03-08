import EventBus from "./EventBus"

export const eventBus = new EventBus();
eventBus.onAny((e) => console.log(e));
