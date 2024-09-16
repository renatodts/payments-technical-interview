/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { describe, it, expect } from "vitest";
import Command from "@/libs/cqrs/command";
import PerformPaymentCommand from "@/apps/payments/application/commands/perform-payment.command";

describe("PerformPaymentCommand", () => {
  it("should initialize with correct properties", () => {
    const payerId = "payerId";
    const pixKey = "pixKey";
    const amount = 100;
    const command = new PerformPaymentCommand(payerId, pixKey, amount);

    expect(command.payerId).toBe(payerId);
    expect(command.pixKey).toBe(pixKey);
    expect(command.amount).toBe(amount);
  });

  it("should inherit from Command", () => {
    const command = new PerformPaymentCommand("payerId", "pixKey", 100);
    expect(command).toBeInstanceOf(Command);
  });
});
