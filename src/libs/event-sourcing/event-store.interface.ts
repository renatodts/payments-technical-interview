/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";
import StreamId from "@/libs/event-sourcing/value-objects/stream-id";

export default abstract class IEventStore {
  abstract persist(event: StreamEvent): Promise<void>;
  abstract persistBulk(events: StreamEvent[]): Promise<void>;
  abstract getEventsByStreamId(streamId: StreamId): Promise<StreamEvent[]>;
}
