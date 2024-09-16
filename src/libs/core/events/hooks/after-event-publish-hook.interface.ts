/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEvent from "@/libs/core/events/event.interface";

export default interface IAfterEventPublishHook {
  afterEventPublish(event: IEvent): void | Promise<void>;
}
