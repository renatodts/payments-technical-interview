/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class PixKey {
  private constructor(readonly value: string) {}

  static create(value: string): PixKey {
    return new PixKey(value);
  }

  toString(): string {
    return this.value;
  }

  equals(pixKey: PixKey): boolean {
    return this.value === pixKey.value;
  }
}
