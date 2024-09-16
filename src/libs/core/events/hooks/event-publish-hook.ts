/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IAfterEventPublishHook from "@/libs/core/events/hooks/after-event-publish-hook.interface";
import IBeforeEventPublishHook from "@/libs/core/events/hooks/before-event-publish-hook.interface";
import EventPublishHookType from "@/libs/core/events/enums/event-publish-hook-type";

export type IEventPublishHook<
  T extends EventPublishHookType = EventPublishHookType
> = {
  [EventPublishHookType.BEFORE_EVENT_PUBLISH]: IBeforeEventPublishHook;
  [EventPublishHookType.AFTER_EVENT_PUBLISH]: IAfterEventPublishHook;
}[T];
