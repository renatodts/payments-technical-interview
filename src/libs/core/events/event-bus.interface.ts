/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IEventListener from "@/libs/core/events/event-listener.interface";
import IEvent from "@/libs/core/events/event.interface";

export default abstract class IEventBus {
  abstract register(event: Type<IEvent>, listener: IEventListener): void;

  abstract publish(event: IEvent): Promise<void>;
}
