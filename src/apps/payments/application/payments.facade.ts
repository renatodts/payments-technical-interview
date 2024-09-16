/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import PerformPaymentCommand from "@/apps/payments/application/commands/perform-payment.command";
import GetPaymentDetailsQuery from "@/apps/payments/application/queries/get-payments-details.query";
import ICommandBus from "@/libs/cqrs/command-bus.interface";
import IQueryBus from "@/libs/cqrs/query-bus.interface";

// This is a design pattern that provides a simplified interface to other layers.
// This facade can be decomposed into multiple, more specialized, facades.
// But in this case, it's not necessary.
@injectable()
export default class PaymentsFacade {
  constructor(
    private readonly queryBus: IQueryBus,
    private readonly commandBus: ICommandBus
  ) {}

  getPaymentDetails(paymentId: string) {
    return this.queryBus.execute(new GetPaymentDetailsQuery(paymentId));
  }

  performPayment(payerId: string, pixKey: string, amount: number) {
    return this.commandBus.execute(
      new PerformPaymentCommand(payerId, pixKey, amount)
    );
  }
}
