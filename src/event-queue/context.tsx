import React from 'react';

export type EventQueueProviderProps = {
    children: React.ReactNode;
    value: (fn?: () => unknown) => Promise<void>;
};

const Context = React.createContext<
    ((fn?: () => unknown) => Promise<void>) | undefined
>(undefined);

const EventQueueProvider: React.FC<EventQueueProviderProps> = ({
    children,
    value
}) => <Context.Provider value={value}>{children}</Context.Provider>;

/*
These events are possible:

1. no event is in progress, execute the request as is.
2. an event is progress, lets append the new request to the queue or assign it if the last has the same event name
3. After a promised event is completed, a request is found in the linked list.
*/

const useEventQueue = () => {
    const inProgress = React.useRef<boolean>(false);
    const queuedFn = React.useRef<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [{ fn?: () => Promise<void>; eventName?: undefined | 'default' | 'transducer' }] | any[]
    >([]);
    const nextEvent = async (
        fn?: () => Promise<void>,
        eventName: undefined | 'default' | 'transducer' = 'default' // default event name all events can use.
    ): Promise<void> => {
        const { eventName: lastEventName } = queuedFn.current?.[
            queuedFn.current.length - 1
        ] ?? { eventName: null };
        // a save is happening
        // & queue is not empty, so we're assigning the first one

        // here we push to the list, b/c the last event queued doesn't match the new one
        if (inProgress.current && lastEventName !== eventName) {
            queuedFn.current.push({
                eventName,
                fn
            });

            return Promise.resolve();
        }

        // a save is happening
        // the last event in the last shares the same name
        if (inProgress.current && lastEventName === eventName) {
            queuedFn.current[queuedFn.current.length - 1] = {
                eventName,
                fn
            };

            return Promise.resolve();
        }

        inProgress.current = true;
        // fn must be a Promise unless you want this to just execute immediately.
        await fn?.();
        inProgress.current = false;

        if (Boolean(queuedFn.current.length)) {
            // request completed, sees that a request was queued up in the meantime.
            // grab the first in the list and send it through.
            const newEvent = queuedFn.current.shift();

            return nextEvent(newEvent?.fn, newEvent.eventName);
        }
    };

    return nextEvent;
};

const useEventQueueContext = () => React.useContext(Context);

export { useEventQueue, useEventQueueContext, EventQueueProvider };
