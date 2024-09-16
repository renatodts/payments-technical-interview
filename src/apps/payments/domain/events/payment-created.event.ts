/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

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
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";
import Position from "@/libs/event-sourcing/value-objects/position";

export class PaymentCreatedEvent extends StreamEvent {
  constructor(
    public readonly paymentId: PaymentId,
    public readonly position: Position,
    public readonly status: Status,
    public readonly payerId: PayerId,
    public readonly amount: Amount,
    public readonly pixKey: PixKey,
    public readonly account: Account,
    public readonly bank: Bank,
    public readonly paidAt: PaidAt,
    public readonly createdAt: CreatedAt,
    public readonly updatedAt: UpdatedAt,
    public readonly occurredAt: OccurredAt
  ) {
    super(paymentId, position, occurredAt);
  }

  serialize(): ISerializedEvent {
    return {
      event: PaymentCreatedEvent.name,
      data: {
        paymentId: this.paymentId.toString(),
        position: this.position.toNumber(),
        status: this.status.toString(),
        payerId: this.payerId.toString(),
        amount: this.amount.toNumber(),
        pixKey: this.pixKey.toString(),
        account: this.account.toString(),
        bank: this.bank.toString(),
        paidAt: this.paidAt.toStringOrNull(),
        createdAt: this.createdAt.toString(),
        updatedAt: this.updatedAt.toStringOrNull(),
        occurredAt: this.occurredAt.toString(),
      },
    };
  }
}
