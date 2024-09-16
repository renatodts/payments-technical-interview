/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface OnApplicationBootstrap {
  onApplicationBootstrap(): void | Promise<void>;
}
