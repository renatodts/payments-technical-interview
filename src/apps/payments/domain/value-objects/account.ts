/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class Account {
  private constructor(readonly value: string) {}

  static create(value: string): Account {
    return new Account(value);
  }

  toString(): string {
    return this.value;
  }

  equals(account: Account): boolean {
    return this.value === account.value;
  }
}
