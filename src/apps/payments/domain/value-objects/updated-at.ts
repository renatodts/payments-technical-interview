/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class UpdatedAt {
  private value: Date | null;

  private constructor(value: Date | null) {
    this.value = value;
  }

  static create(value: Date | string | null): UpdatedAt {
    return new UpdatedAt(value ? new Date(value) : null);
  }

  exists(): boolean {
    return this.value !== null;
  }

  toDate() {
    if (!this.value) {
      throw new Error("Updated at is null");
    }

    return this.value;
  }

  toString(): string {
    if (!this.value) {
      throw new Error("Updated at is null");
    }

    return this.value.toISOString();
  }

  toStringOrNull(): string | null {
    return this.exists() ? this.toString() : null;
  }

  equals(value: UpdatedAt): boolean {
    if (this.value === null || value.value === null) {
      return this.value === value.value;
    }

    return this.toString() === value.toString();
  }
}
