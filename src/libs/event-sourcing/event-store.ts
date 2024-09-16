/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IEventStore from "./event-store.interface";
import StreamId from "./value-objects/stream-id";
import { SerializedStreamMap } from "@/libs/core/events/types";
import ILogger from "@/libs/core/logger/logger.interface";
import IEventDeserializerService from "@/libs/core/events/event-deserializer-service.interface";
import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";

@injectable()
export default class EventStore implements IEventStore {
  // I could implement a database connection here,
  // but for the sake of simplicity, I'm just using a Map.
  private serializedStreamMap: SerializedStreamMap = new Map();

  constructor(
    private readonly logger: ILogger,
    private readonly eventDeserializerService: IEventDeserializerService
  ) {}

  async persist(event: StreamEvent): Promise<void> {
    this.logger.debug(
      `[EVENTSTORE] Persisting event: ${
        Object.getPrototypeOf(event).constructor.name
      }`
    );

    const serializedEvent = event.serialize();
    const serializedStreamId = event.streamId.toString();

    // Create stream if it doesn't exist.
    if (!this.serializedStreamMap.has(serializedStreamId)) {
      this.serializedStreamMap.set(serializedStreamId, []);
    }

    // Get current stream.
    const currentStream = this.serializedStreamMap.get(serializedStreamId)!;

    // Validate event position.
    this.validatePosition(event, currentStream);

    // Push event to stream.
    currentStream.push(serializedEvent);
  }

  private validatePosition(
    event: StreamEvent,
    currentStream: ISerializedEvent[]
  ) {
    const lastPosition =
      currentStream[currentStream.length - 1]?.data.position ?? 0;

    if (event.position.toNumber() !== lastPosition + 1) {
      throw new Error(
        `Invalid event position. Expected ${
          lastPosition + 1
        }, got ${event.position.toNumber()}`
      );
    }
  }

  async persistBulk(events: StreamEvent[]): Promise<void> {
    for (const event of events) {
      // Here I could implement a BullMQ queue to handle events in a more
      // reliable way so that if an event listener fails, the event is not lost.
      // But I'm doing this way for the sake of simplicity for now.
      await this.persist(event);
    }
  }

  // Get events by stream id
  async getEventsByStreamId(streamId: StreamId): Promise<StreamEvent[]> {
    const serializedStreamId = streamId.toString();
    const serializedEvents = this.serializedStreamMap.get(serializedStreamId);

    if (!serializedEvents) {
      return [];
    }

    return serializedEvents.map((serializedEvent) =>
      this.eventDeserializerService.deserialize<StreamEvent>(serializedEvent)
    );
  }
}
