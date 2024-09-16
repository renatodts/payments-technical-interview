/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface IResponse<Value = unknown> {
  __isResponse: true;
  id: number;
  data: Value;
  error?: any;
}
