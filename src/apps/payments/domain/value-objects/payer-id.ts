/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class PayerId {
  private constructor(readonly value: string) {}

  static create(value: string): PayerId {
    return new PayerId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(payerId: PayerId): boolean {
    return this.value === payerId.value;
  }
}
