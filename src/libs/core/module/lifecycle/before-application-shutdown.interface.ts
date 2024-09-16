/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface BeforeApplicationShutdown {
  beforeApplicationShutdown(): void | Promise<void>;
}
