/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { PaymentCompletedEvent } from "@/apps/payments/domain/events/payment-completed.event";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import { PaymentStatusChangedEvent } from "@/apps/payments/domain/events/payment-status-changed.event";
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
import AggregateRootStream from "@/libs/event-sourcing/aggregate-root-stream";
import { LocalHandlersMap } from "@/libs/event-sourcing/types";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";

export default class Payment extends AggregateRootStream {
  public status!: Status;
  public payerId!: PayerId;
  public amount!: Amount;
  public pixKey!: PixKey;
  public account!: Account;
  public bank!: Bank;
  public paidAt!: PaidAt;
  public createdAt!: CreatedAt;
  public updatedAt!: UpdatedAt;

  protected localHandlersMap: LocalHandlersMap<Payment> = new Map();

  constructor(public readonly paymentId: PaymentId) {
    super(paymentId);

    this.registerLocalHandlers();
  }

  private registerLocalHandlers() {
    this.localHandlersMap.set(
      PaymentCreatedEvent, //
      "onPaymentCreated"
    );
    this.localHandlersMap.set(
      PaymentStatusChangedEvent, //
      "onPaymentStatusChanged"
    );
    this.localHandlersMap.set(
      PaymentCompletedEvent, //
      "onPaymentCompleted"
    );
  }

  updateStatus(newStatus: Status, occurredAt: OccurredAt) {
    this.apply(
      new PaymentStatusChangedEvent(
        this.paymentId,
        this.incrementPosition(),
        this.status,
        newStatus,
        occurredAt
      )
    );
  }

  paid(paidAt: PaidAt) {
    if (!paidAt.exists()) {
      throw new Error("PaidAt must be a valid date.");
    }
    const occurredAt = OccurredAt.create(paidAt.toDate());

    this.updateStatus(Status.completed(), occurredAt);

    this.apply(
      new PaymentCompletedEvent(
        this.paymentId,
        this.incrementPosition(),
        paidAt,
        occurredAt
      )
    );
  }

  onPaymentCreated(event: PaymentCreatedEvent) {
    this.status = event.status;
    this.payerId = event.payerId;
    this.amount = event.amount;
    this.pixKey = event.pixKey;
    this.account = event.account;
    this.bank = event.bank;
    this.paidAt = event.paidAt;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }

  onPaymentStatusChanged(event: PaymentStatusChangedEvent) {
    this.status = event.newStatus;

    this.updatedAt = UpdatedAt.create(event.occurredAt.toDate());
  }

  onPaymentCompleted(event: PaymentCompletedEvent) {
    this.paidAt = event.paidAt;

    this.updatedAt = UpdatedAt.create(event.occurredAt.toDate());
  }
}
