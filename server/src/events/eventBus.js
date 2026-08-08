import EventEmitter from "events";

class ExchangeEventBus extends EventEmitter {}

const eventBus = new ExchangeEventBus();

export default eventBus;