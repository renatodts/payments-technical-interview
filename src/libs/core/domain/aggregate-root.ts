/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEventPublisher from "@/libs/core/events/event-publisher.interface";
import IEvent from "@/libs/core/events/event.interface";

const AUTO_COMMIT = Symbol("AUTO_COMMIT");
const STAGED_EVENTS = Symbol("STAGED_EVENTS");

export default abstract class AggregateRoot {
  private [AUTO_COMMIT] = false;
  private readonly [STAGED_EVENTS]: IEvent[] = [];

  protected eventPublisher!: IEventPublisher;

  set autoCommit(value: boolean) {
    this[AUTO_COMMIT] = value;
  }

  get autoCommit(): boolean {
    return this[AUTO_COMMIT];
  }

  publish(event: IEvent): Promise<void> {
    return this.eventPublisher.publish(event);
  }

  publishBulk(events: IEvent[]): Promise<void> {
    return this.eventPublisher.publishBulk(events);
  }

  setEventPublisher(eventPublisher: IEventPublisher): void {
    this.eventPublisher = eventPublisher;
  }

  async commit(): Promise<void> {
    await this.publishBulk(this[STAGED_EVENTS]);

    this[STAGED_EVENTS].length = 0;
  }

  async apply(event: IEvent): Promise<void> {
    if (this.autoCommit) {
      await this.publish(event);
    } else {
      this[STAGED_EVENTS].push(event);
    }
  }
}
