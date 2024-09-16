/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface IInternalDependency {
  initialize(): void | Promise<void>;
}
