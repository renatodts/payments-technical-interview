/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEvent from "@/libs/core/events/event.interface";

export default interface IEventListener<E extends IEvent = IEvent> {
  handle(event: E): Promise<void>;
}
