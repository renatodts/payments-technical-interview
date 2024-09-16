/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEventDeserializer from "@/libs/core/events/event-deserializer.interface";
import IEventListener from "@/libs/core/events/event-listener.interface";
import IEvent from "@/libs/core/events/event.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";

export type EventDeserializerMap = Map<string, IEventDeserializer>;

export type EventBusMap = Map<Type<IEvent>, IEventListener[]>;

export type SerializedStreamMap = Map<string, ISerializedEvent[]>;
