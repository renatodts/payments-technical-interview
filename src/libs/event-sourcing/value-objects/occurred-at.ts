/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class OccurredAt {
  private value: Date;

  private constructor(value: Date | string) {
    this.value = new Date(value);
  }

  static create(value: Date | string): OccurredAt {
    return new OccurredAt(value);
  }

  toDate() {
    return this.value;
  }

  toString(): string {
    return this.value.toISOString();
  }

  equals(value: OccurredAt): boolean {
    return this.toString() === value.toString();
  }
}
