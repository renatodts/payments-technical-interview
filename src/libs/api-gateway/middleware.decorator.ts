/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { MIDDLEWARE_OPTIONS } from "./constants";

// Decorator to define a middleware.
export default function middleware(middlewareClass: Function): MethodDecorator {
  return <T>(
    _: Object,
    propertyKey: symbol | string,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const handler = descriptor.value;
    if (typeof handler !== "function") {
      throw new Error("Middleware must be a method");
    }

    const methodKey = resolveMiddlewareMethodKey(propertyKey);
    const middlewaresClasses = Reflect.getMetadata(methodKey, handler) || [];

    Reflect.defineMetadata(
      methodKey,
      [...middlewaresClasses, middlewareClass],
      handler
    );
  };
}

export const resolveMiddlewareMethodKey = (propertyKey: symbol | string) =>
  `${MIDDLEWARE_OPTIONS.toString()}_${propertyKey.toString()}`;
