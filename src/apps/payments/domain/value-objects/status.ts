/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

export default class Status {
  private constructor(readonly value: string) {
    if (!["pending", "completed", "canceled"].includes(value)) {
      throw new Error("Invalid status");
    }
  }

  static create(value: string): Status {
    return new Status(value);
  }

  static pending(): Status {
    return new Status("pending");
  }

  static completed(): Status {
    return new Status("completed");
  }

  static canceled(): Status {
    return new Status("canceled");
  }

  toString(): string {
    return this.value;
  }

  equals(status: Status): boolean {
    return this.value === status.value;
  }
}
