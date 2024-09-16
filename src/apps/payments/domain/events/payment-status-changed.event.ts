/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import Status from "@/apps/payments/domain/value-objects/status";
import ISerializedEvent from "@/libs/core/events/serialized-event.interface";
import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";
import OccurredAt from "@/libs/event-sourcing/value-objects/occurred-at";
import Position from "@/libs/event-sourcing/value-objects/position";

export class PaymentStatusChangedEvent extends StreamEvent {
  constructor(
    public readonly paymentId: PaymentId,
    public readonly position: Position,
    public readonly oldStatus: Status,
    public readonly newStatus: Status,
    public readonly occurredAt: OccurredAt
  ) {
    super(paymentId, position, occurredAt);
  }

  serialize(): ISerializedEvent {
    return {
      event: PaymentStatusChangedEvent.name,
      data: {
        paymentId: this.paymentId.toString(),
        position: this.position.toNumber(),
        oldStatus: this.oldStatus.toString(),
        newStatus: this.newStatus.toString(),
        occurredAt: this.occurredAt.toString(),
      },
    };
  }
}
