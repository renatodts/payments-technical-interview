/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class StreamId {
  constructor(readonly value: string) {}

  static create(value: string): StreamId {
    return new StreamId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(streamId: StreamId): boolean {
    return this.value === streamId.value;
  }
}
