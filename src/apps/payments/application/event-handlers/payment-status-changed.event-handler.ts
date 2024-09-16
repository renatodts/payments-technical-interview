/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { PaymentStatusChangedEvent } from "../../domain/events/payment-status-changed.event";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import IEventHandler from "@/libs/core/events/event-handler.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import IEventBus from "@/libs/core/events/event-bus.interface";

@injectable()
export default class PaymentStatusChangedEventHandler
  implements IEventHandler<PaymentStatusChangedEvent>, OnModuleInit
{
  constructor(private logger: ILogger, private readonly eventBus: IEventBus) {}

  onModuleInit() {
    this.eventBus.register(PaymentStatusChangedEvent, this);
  }

  handle(event: PaymentStatusChangedEvent): Promise<void> {
    this.logger.debug(
      `[EVENTHANDLER] PaymentStatusChangedEvent: ${event.paymentId} from ${event.oldStatus} to ${event.newStatus}`
    );

    // Here I could implement the logic to send an email to the user
    // informing that the payment status has changed, for example.
    // But I'm doing this way for the sake of simplicity.

    return Promise.resolve();
  }
}
