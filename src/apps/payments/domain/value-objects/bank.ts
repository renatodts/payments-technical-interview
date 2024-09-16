/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class Bank {
  private constructor(readonly value: string) {}

  static create(value: string): Bank {
    return new Bank(value);
  }

  toString(): string {
    return this.value;
  }

  equals(bank: Bank): boolean {
    return this.value === bank.value;
  }
}
