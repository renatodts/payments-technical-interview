/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import createPaymentsApplicationModule from "@/apps/payments/application/payments-application-module.factory";
import { paymentsInfrastructure } from "@/apps/payments/infrastructure/payments-infrastructure";
import { paymentsPresentation } from "@/apps/payments/presentation/payments-presentation";

const PaymentsModule = createPaymentsApplicationModule(
  paymentsInfrastructure,
  paymentsPresentation //
);

export default PaymentsModule;
