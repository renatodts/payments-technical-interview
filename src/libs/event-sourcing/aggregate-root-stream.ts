/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import AggregateRoot from "@/libs/core/domain/aggregate-root";
import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";
import {
  LocalHandler,
  LocalHandlers,
  LocalHandlersMap,
} from "@/libs/event-sourcing/types";
import Position from "@/libs/event-sourcing/value-objects/position";
import StreamId from "@/libs/event-sourcing/value-objects/stream-id";

const POSITION = Symbol("POSITION");

export default abstract class AggregateRootStream extends AggregateRoot {
  private [POSITION] = new Position(0);

  protected abstract localHandlersMap: LocalHandlersMap<any>;

  constructor(public readonly streamId: StreamId) {
    super();
  }

  get position(): Position {
    return this[POSITION];
  }

  setPosition(position: Position): void {
    this[POSITION] = position;
  }

  incrementPosition(): Position {
    this.setPosition(new Position(this.position.value + 1));

    return this.position;
  }

  override async apply(event: StreamEvent): Promise<void> {
    this.applyLocally(event);

    await super.apply(event);
  }

  protected applyLocally(event: StreamEvent) {
    const eventType = Object.getPrototypeOf(event).constructor;

    const localHandlerName = this.localHandlersMap.get(eventType);
    if (!localHandlerName) {
      return;
    }

    const localHandler = (this as unknown as LocalHandlers)[
      localHandlerName
    ] as LocalHandler | undefined;

    if (!localHandler) {
      throw new Error(
        `Local handler for event type ${eventType.name} not found.`
      );
    }

    localHandler.call(this, event);
  }

  hydrate(events: StreamEvent[]): void {
    for (const event of events) {
      this.applyLocally(event);
    }

    if (events.length) {
      const position = events[events.length - 1].position;

      this.setPosition(position);
    }
  }
}
