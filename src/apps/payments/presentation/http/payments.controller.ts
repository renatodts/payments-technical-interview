/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import PaymentsFacade from "@/apps/payments/application/payments.facade";
import { GetPaymentDetailsSchema } from "@/apps/payments/presentation/http/dto/get-payment-details.schema";
import controller from "@/libs/api-gateway/controller.decorator";
import IExceptionHandler from "@/libs/api-gateway/exception-handler.interface";
import middleware from "@/libs/api-gateway/middleware.decorator";
import AuthenticationMiddleware from "@/libs/api-gateway/middlewares/authentication.middleware";
import IRouteRegistrar from "@/libs/api-gateway/route-registrar.interface";
import ForbiddenException from "@/libs/common/exceptions/forbidden.exception";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import { Request, Response } from "express";
import { PerformPaymentSchema } from "@/apps/payments/presentation/http/dto/perform-payment.schema";

@controller()
export default class PaymentsController implements OnModuleInit {
  constructor(
    private readonly logger: ILogger,
    private readonly routeRegistrar: IRouteRegistrar<PaymentsController>,
    private readonly paymentsFacade: PaymentsFacade,
    private readonly exceptionHandler: IExceptionHandler
  ) {}

  // I could implement a decorator to assign routes to methods,
  // but I'm doing it manually for the sake of simplicity.
  onModuleInit() {
    // I've made this type-safe. Try to change the HTTP Method/Verb to see the error.
    this.routeRegistrar.register(this, [
      ["GET /payment/:id", "getPaymentDetails"],
      ["POST /payment", "performPayment"],
    ]);
  }

  @middleware(AuthenticationMiddleware)
  getPaymentDetails(req: Request, res: Response) {
    this.logger.debug("[CONTROLLER] Getting payment...");

    const paymentId = GetPaymentDetailsSchema.parse(req.params.id);

    this.paymentsFacade
      .getPaymentDetails(paymentId)
      .then((result) => {
        // Check if the user has permission to access the payment.
        if (result.payerId !== req.user.id) {
          return this.exceptionHandler.handle(
            new ForbiddenException(
              "You don't have permission to access this payment."
            ),
            req,
            res
          );
        }

        // Return the payment details.
        res.status(200).send(result);
      })
      .catch(
        (error) => this.exceptionHandler.handle(error, req, res) //
      );
  }

  @middleware(AuthenticationMiddleware)
  performPayment(req: Request, res: Response) {
    this.logger.debug("[CONTROLLER] Performing payment...");

    const { pixKey, amount } = PerformPaymentSchema.parse(req.body);

    this.paymentsFacade
      .performPayment(req.user.id, pixKey, amount)
      .then((result) => {
        res.status(201).send(result);
      })
      .catch(
        (error) => this.exceptionHandler.handle(error, req, res) //
      );
  }
}
