/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEvent from "@/libs/core/events/event.interface";

export default interface IEventHandler<T extends IEvent = IEvent> {
  handle(event: T): Promise<void>;
}
