/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { Handler, NextFunction, Request, Response } from "express";
import ILogger from "@/libs/core/logger/logger.interface";
import IModuleRef from "@/libs/core/module/module-ref.interface";
import { resolveMiddlewareMethodKey } from "@/libs/api-gateway/middleware.decorator";
import Middleware from "@/libs/api-gateway/middleware.interface";

@injectable()
export default class MiddlewareDispatcher {
  constructor(
    private readonly logger: ILogger,
    private readonly moduleRef: IModuleRef
  ) {}

  createDispatcher(target: Object, handlerName: string | symbol): Handler {
    const methodKey = resolveMiddlewareMethodKey(handlerName);
    const middlewaresClasses =
      Reflect.getMetadata(
        methodKey,
        target[handlerName as keyof typeof target]
      ) || [];

    const middlewares: Middleware[] = middlewaresClasses.map(
      (middlewareClass: Type<Middleware>) =>
        this.moduleRef.resolve<Middleware>(middlewareClass)
    );

    return (req: Request, res: Response, next: NextFunction) => {
      const middlewareHandler = new Promise<boolean>((resolve, reject) => {
        const nextMiddleware = (index: number) => {
          if (index === middlewares.length) {
            return resolve(true);
          }

          const middleware = middlewares[index];

          middleware
            .handle(req, res)
            .then(() =>
              res.headersSent ? resolve(false) : nextMiddleware(index + 1)
            )
            .catch(reject);
        };

        nextMiddleware(0);
      });

      middlewareHandler //
        .then((dispatch) => dispatch && next())
        .catch((err) => {
          this.logger.error(err);

          res.status(500).send({ message: "Internal application error" });
        });
    };
  }
}
