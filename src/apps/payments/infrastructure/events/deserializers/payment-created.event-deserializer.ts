/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import Account from "@/apps/payments/domain/value-objects/account";
import Amount from "@/apps/payments/domain/value-objects/amount";
import Bank from "@/apps/payments/domain/value-objects/bank";
import CreatedAt from "@/apps/payments/domain/value-objects/created-at";
import PaidAt from "@/apps/payments/domain/value-objects/paid-at";
import PayerId from "@/apps/payments/domain/value-objects/payer-id";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import PixKey from "@/apps/payments/domain/value-objects/pix-key";
import Status from "@/apps/payments/domain/value-objects/status";
import UpdatedAt from "@/apps/payments/domain/value-objects/updated-at";
import IEventDeserializerService from "@/libs/core/events/event-deserializer-service.interface";
import IEventDeserializer from "@/libs/core/events/event-deserializer.interface";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import Position from "@/libs/event-sourcing/value-objects/position";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";

@injectable()
export default class PaymentCreatedEventDeserializer
  implements IEventDeserializer, OnModuleInit
{
  constructor(private eventDeserializerService: IEventDeserializerService) {}

  onModuleInit() {
    this.eventDeserializerService.registerDeserializer(
      PaymentCreatedEvent,
      this
    );
  }

  deserialize(serializedEvent: ISerializedEvent): PaymentCreatedEvent {
    const {
      paymentId,
      position,
      status,
      payerId,
      amount,
      pixKey,
      account,
      bank,
      paidAt,
      createdAt,
      updatedAt,
      occurredAt,
    } = serializedEvent.data;

    return new PaymentCreatedEvent(
      PaymentId.create(paymentId),
      Position.create(position),
      Status.create(status),
      PayerId.create(payerId),
      Amount.create(amount),
      PixKey.create(pixKey),
      Account.create(account),
      Bank.create(bank),
      PaidAt.create(paidAt),
      CreatedAt.create(createdAt),
      UpdatedAt.create(updatedAt),
      OccurredAt.create(occurredAt)
    );
  }
}
