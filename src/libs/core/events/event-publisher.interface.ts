/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import AggregateRoot from "@/libs/core/domain/aggregate-root";
import IBeforeEventPublishHook from "@/libs/core/events/hooks/before-event-publish-hook.interface";
import EventPublishHookType from "@/libs/core/events/enums/event-publish-hook-type";
import IEvent from "@/libs/core/events/event.interface";

export default abstract class IEventPublisher {
  abstract registerHook(
    type: EventPublishHookType,
    hook: IBeforeEventPublishHook
  ): void;
  abstract publish(event: IEvent): Promise<void>;
  abstract publishBulk(events: IEvent[]): Promise<void>;
  abstract mergeObjectContext<T extends AggregateRoot>(aggregateRoot: T): T;
  abstract mergeClassContext<T extends Type<AggregateRoot>>(
    aggregateRootClass: T
  ): T;
}
