/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default abstract class IConfig {
  abstract get<K extends keyof Environment>(key: K): Environment[K] | undefined;
  abstract getOrThrow<K extends keyof Environment>(key: K): Environment[K];
}
