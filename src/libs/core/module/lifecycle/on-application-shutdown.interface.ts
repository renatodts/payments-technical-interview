/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface OnApplicationShutdown {
  onApplicationShutdown(): void | Promise<void>;
}
