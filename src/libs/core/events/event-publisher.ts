/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import AggregateRoot from "@/libs/core/domain/aggregate-root";
import IEventBus from "@/libs/core/events/event-bus.interface";
import IEventPublisher from "@/libs/core/events/event-publisher.interface";
import IEvent from "@/libs/core/events/event.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import EventPublishHookType from "@/libs/core/events/enums/event-publish-hook-type";
import { IEventPublishHook } from "@/libs/core/events/hooks/event-publish-hook";
import IBeforeEventPublishHook from "@/libs/core/events/hooks/before-event-publish-hook.interface";
import IAfterEventPublishHook from "@/libs/core/events/hooks/after-event-publish-hook.interface";

@injectable()
export default class EventPublisher implements IEventPublisher {
  private hooksRegistry = new Map<EventPublishHookType, IEventPublishHook[]>();

  constructor(
    private readonly logger: ILogger,
    private readonly eventBus: IEventBus
  ) {}

  // Registers a hook to be executed at a given event publish stage.
  registerHook(type: EventPublishHookType, hook: IEventPublishHook) {
    this.logger.debug(`[EVENTPUBLISHER] Hook ${hook.constructor.name}`);

    if (!this.hooksRegistry.has(type)) {
      this.hooksRegistry.set(type, []);
    }

    this.hooksRegistry.get(type)!.push(hook);
  }

  // Here I could implement a BullMQ queue to handle events in a more
  // reliable way so if an execution fails, side effects are controlled.
  // But I'm doing this way for the sake of simplicity for now.
  async publish(event: IEvent) {
    this.logger.debug(
      `[EVENTPUBLISHER] Publishing event: ${event.constructor.name}`
    );

    await this.dispatchHook(EventPublishHookType.BEFORE_EVENT_PUBLISH, event);

    await this.eventBus.publish(event);

    await this.dispatchHook(EventPublishHookType.AFTER_EVENT_PUBLISH, event);
  }

  async publishBulk(events: IEvent[]) {
    for (const event of events) {
      await this.publish(event);
    }
  }

  // Dispatches hooks of a given type.
  private async dispatchHook(
    type: EventPublishHookType,
    event: IEvent
  ): Promise<void> {
    for (const hook of this.hooksRegistry.get(type) || []) {
      switch (type) {
        case EventPublishHookType.BEFORE_EVENT_PUBLISH:
          await (hook as IBeforeEventPublishHook).beforeEventPublish(event);
          break;
        case EventPublishHookType.AFTER_EVENT_PUBLISH:
          await (hook as IAfterEventPublishHook).afterEventPublish(event);
          break;
        default:
          throw new Error(`Hook type ${type} found`);
      }
    }
  }

  mergeObjectContext<T extends AggregateRoot>(aggregateRoot: T): T {
    aggregateRoot.setEventPublisher(this);

    return aggregateRoot;
  }

  mergeClassContext<T extends Type<AggregateRoot>>(aggregateRootClass: T): T {
    const self = this;

    return class extends aggregateRootClass {
      constructor(...args: any[]) {
        super(...args);
        this.setEventPublisher(self);
      }
    };
  }
}
