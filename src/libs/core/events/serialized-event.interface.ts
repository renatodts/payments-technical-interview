/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface ISerializedEvent {
  event: string;
  data: Record<string, any>;
}
