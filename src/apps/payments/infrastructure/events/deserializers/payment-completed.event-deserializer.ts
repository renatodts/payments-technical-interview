/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { PaymentCompletedEvent } from "@/apps/payments/domain/events/payment-completed.event";
import PaidAt from "@/apps/payments/domain/value-objects/paid-at";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import IEventDeserializerService from "@/libs/core/events/event-deserializer-service.interface";
import IEventDeserializer from "@/libs/core/events/event-deserializer.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import Position from "@/libs/event-sourcing/value-objects/position";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";

@injectable()
export default class PaymentCompletedEventDeserializer
  implements IEventDeserializer, OnModuleInit
{
  constructor(private eventDeserializerService: IEventDeserializerService) {}

  onModuleInit() {
    this.eventDeserializerService.registerDeserializer(
      PaymentCompletedEvent,
      this
    );
  }

  deserialize(serializedEvent: ISerializedEvent): PaymentCompletedEvent {
    const { paymentId, position, paidAt, occurredAt } = serializedEvent.data;

    return new PaymentCompletedEvent(
      PaymentId.create(paymentId),
      Position.create(position),
      PaidAt.create(paidAt),
      OccurredAt.create(occurredAt)
    );
  }
}
