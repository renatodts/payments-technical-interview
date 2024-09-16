/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import EventPublishHookType from "@/libs/core/events/enums/event-publish-hook-type";
import IEventPublisher from "@/libs/core/events/event-publisher.interface";
import IEvent from "@/libs/core/events/event.interface";
import IBeforeEventPublishHook from "@/libs/core/events/hooks/before-event-publish-hook.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import IEventStore from "@/libs/event-sourcing/event-store.interface";
import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";
import { injectable } from "inversify";

@injectable()
export default class BeforeEventPublish
  implements IBeforeEventPublishHook, OnModuleInit
{
  constructor(
    private readonly logger: ILogger,
    private readonly eventPublisher: IEventPublisher,
    private readonly eventStore: IEventStore
  ) {}

  onModuleInit() {
    this.eventPublisher.registerHook(
      EventPublishHookType.BEFORE_EVENT_PUBLISH,
      this
    );
  }

  async beforeEventPublish(event: IEvent): Promise<void> {
    if (!(event instanceof StreamEvent)) {
      return;
    }

    this.logger.debug(
      `[EVENTSOURCING] BeforeEventPublishHook: ${event.constructor.name}`
    );

    await this.eventStore.persist(event);
  }
}
