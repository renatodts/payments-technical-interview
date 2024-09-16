/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IMaterializedPaymentDetailsRepository from "@/apps/payments/application/ports/materialized-payments-details-repository.interface";
import { PaymentCompletedEvent } from "@/apps/payments/domain/events/payment-completed.event";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import { PaymentStatusChangedEvent } from "@/apps/payments/domain/events/payment-status-changed.event";
import Payment from "@/apps/payments/domain/payment";
import IEventBus from "@/libs/core/events/event-bus.interface";
import IEventHandler from "@/libs/core/events/event-handler.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import IAggregateHydrator from "@/libs/event-sourcing/aggregate-hydrator.interface";

@injectable()
export default class UpdatePaymentReadModelsEventHandler
  implements IEventHandler<PaymentCreatedEvent>, OnModuleInit
{
  constructor(
    private logger: ILogger,
    private readonly eventBus: IEventBus,
    private readonly aggregateHydrator: IAggregateHydrator,
    private readonly materializedPaymentDetailsRepository: IMaterializedPaymentDetailsRepository
  ) {}

  onModuleInit() {
    this.eventBus.register(PaymentCreatedEvent, this);
    this.eventBus.register(PaymentStatusChangedEvent, this);
    this.eventBus.register(PaymentCompletedEvent, this);
  }

  async handle(
    event:
      | PaymentCreatedEvent
      | PaymentStatusChangedEvent
      | PaymentCompletedEvent
  ): Promise<void> {
    this.logger.debug(
      `[EVENTHANDLER] Updating read models: ${event.paymentId.value}`
    );

    // Get the payment from the event store.
    const payment = await this.aggregateHydrator.hydrate(
      Payment,
      event.paymentId
    );

    // Upsert the payment details in the read model.
    await this.materializedPaymentDetailsRepository.upsert(payment);
  }
}
