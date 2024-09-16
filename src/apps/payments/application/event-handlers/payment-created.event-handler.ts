/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import Payment from "@/apps/payments/domain/payment";
import IMonthlyPaymentsRepository from "@/apps/payments/domain/repositories/monthly-payments-repository.interface";
import IEventBus from "@/libs/core/events/event-bus.interface";
import IEventHandler from "@/libs/core/events/event-handler.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import IAggregateHydrator from "@/libs/event-sourcing/aggregate-hydrator.interface";

@injectable()
export default class PaymentCreatedEventHandler
  implements IEventHandler<PaymentCreatedEvent>, OnModuleInit
{
  constructor(
    private logger: ILogger,
    private readonly eventBus: IEventBus,
    private readonly aggregateHydrator: IAggregateHydrator,
    private readonly monthlyPaymentsRepository: IMonthlyPaymentsRepository
  ) {}

  onModuleInit() {
    this.eventBus.register(PaymentCreatedEvent, this);
  }

  async handle(event: PaymentCreatedEvent): Promise<void> {
    this.logger.debug(
      `[EVENTHANDLER] PaymentCreatedEvent: ${event.paymentId.value}`
    );

    const payment = await this.aggregateHydrator.hydrate(
      Payment,
      event.paymentId
    );

    // Handle critical repositories for business rules.
    await this.monthlyPaymentsRepository.upsert(payment);

    // Release lock for payer.
    await this.releaseLock(payment);
  }

  // This method is a placeholder for a real lock release mechanism.
  private async releaseLock(payment: Payment) {
    this.logger.debug(
      `[EVENTHANDLER] Release lock for payer: ${payment.payerId.toString()}`
    );

    // Here I could apply a lock release event to allow a new payment to be
    // requested. This would be useful to avoid concurrency issues.

    // ...
  }
}
