/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import PerformPaymentCommandHandler from "@/apps/payments/application/commands/perform-payment.command-handler";
import PayAfterOneSecondEventHandler from "@/apps/payments/application/event-handlers/pay-after-one-second.event-handler";
import PaymentCreatedEventHandler from "@/apps/payments/application/event-handlers/payment-created.event-handler";
import PaymentStatusChangedEventHandler from "@/apps/payments/application/event-handlers/payment-status-changed.event-handler";
import UpdatePaymentReadModelsEventHandler from "@/apps/payments/application/event-handlers/update-payment-read-models.event-handler";
import PaymentsFacade from "@/apps/payments/application/payments.facade";
import GetPaymentsDetailsQueryHandler from "@/apps/payments/application/queries/get-payments-details.query-handler";
import {
  PaymentsInfrastructure,
  PaymentsPresentation,
} from "@/apps/payments/application/types";
import PaymentFactory from "@/apps/payments/domain/factories/payment.factory";
import PixMonthlyLimitPolicy from "@/apps/payments/domain/policies/pix-monthly-limit.policy";
import PixTimeAmountPolicy from "@/apps/payments/domain/policies/pix-time-amount.policy";
import module from "@/libs/core/module/module.decorator";
import { IModule } from "@/libs/core/module/module.interface";

export default function createPaymentsApplicationModule(
  infrastructure: PaymentsInfrastructure,
  presentation: PaymentsPresentation
): Type<IModule> {
  @module({
    controllers: [
      ...(presentation.controllers ?? []), //
    ],
    bindings: [
      // Bindings
      ...(infrastructure.bindings ?? []),
      ...(presentation.bindings ?? []),

      // Facades
      PaymentsFacade,

      // Factories
      PaymentFactory,

      // Policies
      PixTimeAmountPolicy,
      PixMonthlyLimitPolicy,

      // Command handlers
      PerformPaymentCommandHandler,

      // Query handlers
      GetPaymentsDetailsQueryHandler,

      // Event handlers
      PaymentCreatedEventHandler,
      UpdatePaymentReadModelsEventHandler,
      PayAfterOneSecondEventHandler,
      PaymentStatusChangedEventHandler,
    ],
  })
  class PaymentsApplicationModule {}

  return PaymentsApplicationModule;
}
