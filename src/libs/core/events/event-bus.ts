/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { EventBusMap } from "./types";
import ILogger from "../../core/logger/logger.interface";
import IEventBus from "@/libs/core/events/event-bus.interface";
import IEvent from "@/libs/core/events/event.interface";
import IEventListener from "@/libs/core/events/event-listener.interface";

@injectable()
export default class EventBus implements IEventBus {
  private listeners: EventBusMap = new Map();

  constructor(private logger: ILogger) {}

  register(event: Type<IEvent>, listener: IEventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push(listener);
  }

  async publish(event: IEvent): Promise<void> {
    this.logger.info(`[EVENTBUS] Dispatching event: ${event.constructor.name}`);

    const listeners = this.listeners.get(event.constructor as Type<IEvent>);
    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      // Here I could implement a BullMQ queue to handle events in a more
      // reliable way so that if an event listener fails, the event is not lost.
      // But I'm doing this way for the sake of simplicity.
      await listener.handle(event);
    }
  }
}
