/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import AfterApplicationBootstrap from "@/libs/core/module/lifecycle/after-application-bootstrap.interface";
import BeforeApplicationShutdown from "@/libs/core/module/lifecycle/before-application-shutdown.interface";
import ILogger from "@/libs/core/logger/logger.interface";

@injectable()
export class LifecycleExpressMiddleware
  implements AfterApplicationBootstrap, BeforeApplicationShutdown
{
  private nextRequestId = 1;
  private acceptNewRequests = false;

  constructor(private readonly logger: ILogger) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const requestId = this.generateRequestId();
    this.setCustomRequestProperties(req, requestId);
    this.attachListeners(requestId, res);

    if (!this.acceptNewRequests) {
      // Here I could store the request in a queue and process it later
      // or return a 503 status code to indicate that the service is unavailable
      // and trust that the client will retry the request later.

      this.logger.debug(
        `[REQUEST] Request #${requestId} rejected due service unavailability`
      );

      res.status(503).send("Service unavailable");
    } else next();
  }

  private generateRequestId(): number {
    return this.nextRequestId++;
  }

  private setCustomRequestProperties(req: Request, requestId: number) {
    req.requestId = requestId;
    req.isAuthenticated = false;
  }

  private attachListeners(requestId: number, res: Response) {
    this.logger.debug(
      `[REQUEST] ${this.logger.bold(
        this.logger.whiteBright(
          `Request #${requestId} received from ${res.req.ip}`
        )
      )}`
    );

    res.once("finish", () => {
      this.logger.debug(
        `[REQUEST] ${this.logger.bold(
          this.logger.whiteBright(`Request #${requestId} finished`)
        )}`
      );
    });
  }

  afterApplicationBootstrap() {
    this.acceptNewRequests = true;
  }

  beforeApplicationShutdown() {
    this.acceptNewRequests = false;
  }
}
