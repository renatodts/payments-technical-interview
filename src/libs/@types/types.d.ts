/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

declare type Type<T = unknown> = new (...args: any[]) => T;

declare type AbstractType<T = unknown> = abstract new (...args: any[]) => T;

declare type MethodsOf<Target> = {
  [K in keyof Target]: Target[K] extends Function ? K : never;
}[keyof Target];
