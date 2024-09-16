/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEvent from "@/libs/core/events/event.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";

export default interface IEventDeserializer<E extends IEvent = IEvent> {
  deserialize(event: ISerializedEvent): E;
}
