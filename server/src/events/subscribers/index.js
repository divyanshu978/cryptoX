import marketSubscriber from "./market.subscriber.js";

export const initializeSubscribers = () => {

    marketSubscriber.initialize();

    console.log(
        "Event subscribers initialized"
    );
};