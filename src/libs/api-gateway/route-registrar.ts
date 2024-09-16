/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import ExpressServer from "@/libs/api-gateway/express-server";
import { LifecycleExpressMiddleware } from "@/libs/api-gateway/lifecycle.express-middleware";
import MiddlewareDispatcher from "@/libs/api-gateway/middleware-dispatcher";
import IRouteRegistrar from "@/libs/api-gateway/route-registrar.interface";
import { IRouteAssign, IRouteInput } from "@/libs/api-gateway/types";
import ILogger from "@/libs/core/logger/logger.interface";
import BeforeApplicationBootstrap from "@/libs/core/module/lifecycle/before-application-bootstrap.interface";

type ResolvedInput = {
  method: "get" | "post" | "put" | "delete";
  path: string;
};

@injectable()
export class RouteRegistrar
  implements IRouteRegistrar, BeforeApplicationBootstrap
{
  private registers: [Object, IRouteAssign[]][];

  constructor(
    private readonly logger: ILogger,
    private readonly express: ExpressServer,
    private readonly lifecycleMiddleware: LifecycleExpressMiddleware,
    private readonly middlewareDispatcher: MiddlewareDispatcher
  ) {
    this.registers = [];
  }

  // Register routes only after all modules have
  // been initialized to avoid dependencies issues.
  beforeApplicationBootstrap(): void | Promise<void> {
    for (const [target, routes] of this.registers) {
      for (const [input, handlerName] of routes) {
        const { method, path } = this.resolveInput(input);

        this.express
          .getExpressApp()
          [method](
            path,
            this.lifecycleMiddleware.handle.bind(this.lifecycleMiddleware),
            this.middlewareDispatcher.createDispatcher(target, handlerName),
            target[handlerName as keyof typeof target].bind(target)
          );

        this.logger.info(`[ROUTE] Assigned ${input}`);
      }
    }
  }

  register(target: Object, routes: IRouteAssign[]) {
    this.registers.push([target, routes]);
  }

  private resolveInput(input: IRouteInput): ResolvedInput {
    const inputParts = input.trim().split(" ");

    const method = inputParts.shift()?.toLowerCase() as ResolvedInput["method"];
    if (!method) {
      throw new Error("Invalid route input");
    }

    const path = inputParts.join(" ").trim() as ResolvedInput["path"];
    if (!path) {
      throw new Error("Invalid route input");
    }

    return {
      method,
      path,
    };
  }
}
