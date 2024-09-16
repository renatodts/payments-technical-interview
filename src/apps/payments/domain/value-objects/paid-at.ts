/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class PaidAt {
  private value: Date | null;

  private constructor(value: Date | null) {
    this.value = value;
  }

  static create(value: Date | string | null): PaidAt {
    return new PaidAt(value ? new Date(value) : null);
  }

  exists(): boolean {
    return this.value !== null;
  }

  toDate() {
    if (!this.value) {
      throw new Error("Paid at is null");
    }

    return this.value;
  }

  toString(): string {
    if (!this.value) {
      throw new Error("Paid at is null");
    }

    return this.value.toISOString();
  }

  toStringOrNull(): string | null {
    return this.exists() ? this.toString() : null;
  }

  equals(value: PaidAt): boolean {
    if (this.value === null || value.value === null) {
      return this.value === value.value;
    }

    return this.toString() === value.toString();
  }
}
