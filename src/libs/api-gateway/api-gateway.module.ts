/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import module from "@/libs/core/module/module.decorator";
import ExceptionHandler from "@/libs/api-gateway/exception-handler";
import MiddlewareDispatcher from "@/libs/api-gateway/middleware-dispatcher";
import { LifecycleExpressMiddleware } from "@/libs/api-gateway/lifecycle.express-middleware";
import IRouteRegistrar from "@/libs/api-gateway/route-registrar.interface";
import { RouteRegistrar } from "@/libs/api-gateway/route-registrar";
import ExpressServer from "@/libs/api-gateway/express-server";
import IExceptionHandler from "@/libs/api-gateway/exception-handler.interface";

@module({
  bindings: [
    ExpressServer,
    MiddlewareDispatcher,
    LifecycleExpressMiddleware,
    { bind: IRouteRegistrar, useClass: RouteRegistrar },
    { bind: IExceptionHandler, useClass: ExceptionHandler },
  ],
})
export default class ApiGatewayModule {}
