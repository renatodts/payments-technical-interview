/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import StreamId from "@/libs/event-sourcing/value-objects/stream-id";

export default class PaymentId extends StreamId {
  static create(value: string): PaymentId {
    return new PaymentId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(paymentId: PaymentId): boolean {
    return this.value === paymentId.value;
  }
}
