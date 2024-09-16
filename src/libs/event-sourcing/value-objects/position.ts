/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class Position {
  constructor(readonly value: number) {}

  static create(position: number): Position {
    return new Position(position);
  }

  toNumber(): number {
    return this.value;
  }

  equals(position: Position): boolean {
    return this.value === position.value;
  }
}
