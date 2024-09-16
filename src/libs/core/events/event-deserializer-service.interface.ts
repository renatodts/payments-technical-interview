/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEventDeserializer from "@/libs/core/events/event-deserializer.interface";
import IEvent from "@/libs/core/events/event.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";

export default abstract class IEventDeserializerService {
  abstract registerDeserializer(
    event: Type<IEvent>,
    deserializer: IEventDeserializer
  ): void;

  abstract deserialize<E extends IEvent = IEvent>(
    serializedEvent: ISerializedEvent
  ): E;
}
