import eventBus from "./eventBus.js";

class Publisher {

    publish(event, payload) {

        eventBus.emit(event, payload);

    }

}

export default new Publisher();