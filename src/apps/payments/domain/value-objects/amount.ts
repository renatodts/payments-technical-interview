/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class Amount {
  private constructor(readonly value: number) {
    if (value <= 0) {
      throw new Error("Amount must be greater than 0");
    }
  }

  static create(value: number): Amount {
    return new Amount(value);
  }

  toNumber(): number {
    return this.value;
  }

  equals(amount: Amount): boolean {
    return this.value === amount.value;
  }
}
