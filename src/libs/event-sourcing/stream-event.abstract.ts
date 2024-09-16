/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEvent from "@/libs/core/events/event.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";
import Position from "@/libs/event-sourcing/value-objects/position";
import StreamId from "@/libs/event-sourcing/value-objects/stream-id";

export default abstract class StreamEvent implements IEvent {
  constructor(
    public readonly streamId: StreamId,
    public readonly position: Position,
    public readonly occurredAt: OccurredAt
  ) {}

  abstract serialize(): ISerializedEvent;
}
