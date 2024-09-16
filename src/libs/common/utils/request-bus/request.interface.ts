/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface IRequest<Value = unknown> {
  __isRequest: true;
  id: number;
  data: Value;
}
