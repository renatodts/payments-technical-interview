/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import module from "@/libs/core/module/module.decorator";
import IEventStore from "@/libs/event-sourcing/event-store.interface";
import EventStore from "@/libs/event-sourcing/event-store";
import IAggregateHydrator from "@/libs/event-sourcing/aggregate-hydrator.interface";
import AggregateHydrator from "@/libs/event-sourcing/aggregate-hydrator";
import BeforeEventPublish from "@/libs/event-sourcing/hooks/before-event-publish.hook";

@module({
  bindings: [
    { bind: IEventStore, useClass: EventStore },
    { bind: IAggregateHydrator, useClass: AggregateHydrator },
    BeforeEventPublish,
  ],
})
export default class EventSourcingModule {}
