/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { PaymentStatusChangedEvent } from "@/apps/payments/domain/events/payment-status-changed.event";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import Status from "@/apps/payments/domain/value-objects/status";
import IEventDeserializerService from "@/libs/core/events/event-deserializer-service.interface";
import IEventDeserializer from "@/libs/core/events/event-deserializer.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import Position from "@/libs/event-sourcing/value-objects/position";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";

@injectable()
export default class PaymentStatusChangedEventDeserializer
  implements IEventDeserializer, OnModuleInit
{
  constructor(private eventDeserializerService: IEventDeserializerService) {}

  onModuleInit() {
    this.eventDeserializerService.registerDeserializer(
      PaymentStatusChangedEvent,
      this
    );
  }

  deserialize(serializedEvent: ISerializedEvent): PaymentStatusChangedEvent {
    const { paymentId, position, oldStatus, newStatus, occurredAt } =
      serializedEvent.data;

    return new PaymentStatusChangedEvent(
      PaymentId.create(paymentId),
      Position.create(position),
      Status.create(oldStatus),
      Status.create(newStatus),
      OccurredAt.create(occurredAt)
    );
  }
}
