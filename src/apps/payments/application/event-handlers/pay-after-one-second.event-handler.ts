/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import Payment from "@/apps/payments/domain/payment";
import PaidAt from "@/apps/payments/domain/value-objects/paid-at";
import IEventBus from "@/libs/core/events/event-bus.interface";
import IEventHandler from "@/libs/core/events/event-handler.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import IAggregateHydrator from "@/libs/event-sourcing/aggregate-hydrator.interface";

@injectable()
export default class PayAfterOneSecondEventHandler
  implements IEventHandler<PaymentCreatedEvent>, OnModuleInit
{
  constructor(
    private logger: ILogger,
    private readonly eventBus: IEventBus,
    private readonly aggregateHydrator: IAggregateHydrator
  ) {}

  onModuleInit() {
    this.eventBus.register(PaymentCreatedEvent, this);
  }

  // This is a demo event handler that simulates a payment process.
  async handle(event: PaymentCreatedEvent): Promise<void> {
    this.logger.debug(
      `[EVENTHANDLER] Payment completion scheduled: ${event.paymentId.value}`
    );

    // Get the payment from the event store.
    const payment = await this.aggregateHydrator.hydrate(
      Payment,
      event.paymentId
    );

    // Simulate a payment process.
    setTimeout(() => {
      // Mark the payment as paid.
      const paidAt = PaidAt.create(new Date());
      payment.paid(paidAt);

      // Commit the payment.
      payment
        .commit() //
        .catch((error) => this.logger.error(error));

      this.logger.debug(
        `[EVENTHANDLER] Payment completion triggered: ${payment.paymentId.toString()}`
      );
    }, 1000);
  }
}
