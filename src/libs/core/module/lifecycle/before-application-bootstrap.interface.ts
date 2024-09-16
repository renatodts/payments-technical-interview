/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface BeforeApplicationBootstrap {
  beforeApplicationBootstrap(): void | Promise<void>;
}
