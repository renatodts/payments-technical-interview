/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import module from "@/libs/core/module/module.decorator";

// Events
import IEventDeserializerService from "@/libs/core/events/event-deserializer-service.interface";
import EventDeserializerService from "@/libs/core/events/event-deserializer.service";
import IEventPublisher from "@/libs/core/events/event-publisher.interface";
import EventPublisher from "@/libs/core/events/event-publisher";
import IEventBus from "@/libs/core/events/event-bus.interface";
import EventBus from "@/libs/core/events/event-bus";

@module({
  bindings: [
    // Events
    { bind: IEventDeserializerService, useClass: EventDeserializerService },
    { bind: IEventPublisher, useClass: EventPublisher },
    { bind: IEventBus, useClass: EventBus },
  ],
})
export default class CoreModule {}
