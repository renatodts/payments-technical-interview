/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { PaymentsPresentation } from "@/apps/payments/application/types";
import PaymentsController from "@/apps/payments/presentation/http/payments.controller";
import AuthenticationMiddleware from "@/libs/api-gateway/middlewares/authentication.middleware";

export const paymentsPresentation: PaymentsPresentation = {
  controllers: [PaymentsController],
  bindings: [
    // Middlewares
    AuthenticationMiddleware,
  ],
};
