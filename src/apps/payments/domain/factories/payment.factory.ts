/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { randomUUID } from "crypto";
import { injectable } from "inversify";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import Payment from "@/apps/payments/domain/payment";
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
import IEventPublisher from "@/libs/core/events/event-publisher.interface";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";

@injectable()
export default class PaymentFactory {
  constructor(private readonly eventPublisher: IEventPublisher) {}

  create(
    status: Status,
    payerId: PayerId,
    amount: Amount,
    pixKey: PixKey,
    account: Account,
    bank: Bank,
    paidAt?: PaidAt,
    createdAt?: CreatedAt,
    updatedAt?: UpdatedAt
  ): Payment {
    const paymentId = new PaymentId(randomUUID());
    const paymentClass = this.eventPublisher.mergeClassContext(Payment);
    const payment = new paymentClass(paymentId);

    const _createdAt = createdAt || CreatedAt.create(new Date());

    payment.apply(
      new PaymentCreatedEvent(
        paymentId,
        payment.incrementPosition(),
        status,
        payerId,
        amount,
        pixKey,
        account,
        bank,
        paidAt || PaidAt.create(null),
        _createdAt,
        updatedAt || UpdatedAt.create(null),
        OccurredAt.create(_createdAt.toDate())
      )
    );

    return payment;
  }

  createPending(
    payerId: PayerId,
    amount: Amount,
    pixKey: PixKey,
    account: Account,
    bank: Bank,
    createdAt?: CreatedAt,
    updatedAt?: UpdatedAt
  ): Payment {
    return this.create(
      Status.create("pending"),
      payerId,
      amount,
      pixKey,
      account,
      bank,
      PaidAt.create(null),
      createdAt,
      updatedAt
    );
  }
}
