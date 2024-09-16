/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class CreatedAt {
  private value: Date;

  private constructor(value: Date | string) {
    this.value = new Date(value);
  }

  static create(value: Date | string): CreatedAt {
    return new CreatedAt(value);
  }

  toDate() {
    return this.value;
  }

  toString(): string {
    return this.value.toISOString();
  }

  equals(value: CreatedAt): boolean {
    return this.toString() === value.toString();
  }
}
