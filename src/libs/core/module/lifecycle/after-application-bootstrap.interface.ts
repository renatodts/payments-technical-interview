/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default interface AfterApplicationBootstrap {
  afterApplicationBootstrap(): void | Promise<void>;
}
