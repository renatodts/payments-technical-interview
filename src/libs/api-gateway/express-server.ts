/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import express, { Application, NextFunction, Request, Response } from "express";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import AfterApplicationBootstrap from "@/libs/core/module/lifecycle/after-application-bootstrap.interface";
import OnApplicationShutdown from "@/libs/core/module/lifecycle/on-application-shutdown.interface";
import IConfig from "@/libs/core/config/config.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import IExceptionHandler from "@/libs/api-gateway/exception-handler.interface";
import { Server } from "http";

@injectable()
export default class ExpressServer
  implements OnModuleInit, AfterApplicationBootstrap, OnApplicationShutdown
{
  private httpPort!: number;
  private expressApp!: Application;
  private expressServer!: Server;

  constructor(
    private readonly config: IConfig,
    private readonly logger: ILogger,
    private readonly exceptionHandler: IExceptionHandler
  ) {}

  async onModuleInit() {
    this.httpPort = this.config.getOrThrow("HTTP_PORT");

    this.initExpressApp();
  }

  private initExpressApp() {
    const app = express();
    app.use(express.json());

    this.expressApp = app;
  }

  getExpressApp(): Application {
    return this.expressApp;
  }

  async afterApplicationBootstrap() {
    return new Promise<void>((resolve) => {
      // Handle errors globally, right before sending the response.
      // Its ideal to register it here, so it can be the last middleware.
      this.expressApp.use(this.errorHandlerMiddleware.bind(this));

      // Start the application on the specified port.
      this.expressServer = this.expressApp.listen(this.httpPort, () => {
        this.logger.info(
          `[EXPRESS] Express server is running on port ${this.httpPort}`
        );

        resolve();
      });
    });
  }

  onApplicationShutdown() {
    return new Promise<void>((resolve, reject) => {
      this.expressServer.closeAllConnections();

      this.expressServer.close((err) => {
        this.logger.info("[EXPRESS] Express server has been shut down");

        err ? reject(err) : resolve();
      });
    });
  }

  protected errorHandlerMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!err) {
      return next();
    }

    this.exceptionHandler.handle(err, req, res).catch(() => {
      // I could implement a persistent error logging mechanism here
      // to store the error in a better way, as it's a critical error.
      // For now, I'm just logging it to the console.
      this.logger.error(err);

      res.status(500).send({
        message: "Internal application error", //
      });
    });
  }
}
