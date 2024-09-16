/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IEventDeserializerService from "@/libs/core/events/event-deserializer-service.interface";
import IEventDeserializer from "@/libs/core/events/event-deserializer.interface";
import IEvent from "@/libs/core/events/event.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import { EventDeserializerMap } from "@/libs/core/events/types";

@injectable()
export default class EventDeserializerService
  implements IEventDeserializerService
{
  private eventDeserializerMap: EventDeserializerMap = new Map();

  registerDeserializer(
    event: Type<IEvent>,
    deserializer: IEventDeserializer
  ): void {
    this.eventDeserializerMap.set(event.name, deserializer);
  }

  deserialize<E extends IEvent = IEvent>(serializedEvent: ISerializedEvent): E {
    const deserializer = this.eventDeserializerMap.get(serializedEvent.event);

    if (!deserializer) {
      throw new Error(
        `Deserializer not found for event type "${serializedEvent.event}"`
      );
    }

    return deserializer.deserialize(serializedEvent) as E;
  }
}
