/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import ISerializedEvent from "@/libs/core/events/serialized-event.interface";

export default interface IEvent {
  serialize(): ISerializedEvent;
}
