/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import PaidAt from "@/apps/payments/domain/value-objects/paid-at";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";
import Position from "@/libs/event-sourcing/value-objects/position";

export class PaymentCompletedEvent extends StreamEvent {
  constructor(
    public readonly paymentId: PaymentId,
    public readonly position: Position,
    public readonly paidAt: PaidAt,
    public readonly occurredAt: OccurredAt
  ) {
    super(paymentId, position, occurredAt);
  }

  serialize(): ISerializedEvent {
    return {
      event: PaymentCompletedEvent.name,
      data: {
        paymentId: this.paymentId.toString(),
        position: this.position.toNumber(),
        paidAt: this.paidAt.toString(),
        occurredAt: this.occurredAt.toString(),
      },
    };
  }
}
