/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import "reflect-metadata";
import PerformPaymentCommand from "@/apps/payments/application/commands/perform-payment.command";
import PerformPaymentCommandHandler from "@/apps/payments/application/commands/perform-payment.command-handler";
import IPixApi from "@/apps/payments/application/ports/pix-api.interface";
import PixPaymentNotAllowedException from "@/apps/payments/domain/exceptions/pix-payment-not-allowed.exception";
import PaymentFactory from "@/apps/payments/domain/factories/payment.factory";
import Payment from "@/apps/payments/domain/payment";
import PixMonthlyLimitPolicy from "@/apps/payments/domain/policies/pix-monthly-limit.policy";
import PixTimeAmountPolicy from "@/apps/payments/domain/policies/pix-time-amount.policy";
import Account from "@/apps/payments/domain/value-objects/account";
import Amount from "@/apps/payments/domain/value-objects/amount";
import Bank from "@/apps/payments/domain/value-objects/bank";
import CreatedAt from "@/apps/payments/domain/value-objects/created-at";
import PaidAt from "@/apps/payments/domain/value-objects/paid-at";
import PayerId from "@/apps/payments/domain/value-objects/payer-id";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import PixKey from "@/apps/payments/domain/value-objects/pix-key";
import Status from "@/apps/payments/domain/value-objects/status";
import UpdatedAt from "@/apps/payments/domain/value-objects/updated-at";
import ILogger from "@/libs/core/logger/logger.interface";
import ICommandBus from "@/libs/cqrs/command-bus.interface";
import { describe, vi, beforeEach, it, expect } from "vitest";

describe("PerformPaymentCommandHandler", () => {
  let logger: ILogger;
  let commandBus: ICommandBus;
  let paymentFactory: PaymentFactory;
  let pixApi: IPixApi;
  let pixTimeAmountPolicy: PixTimeAmountPolicy;
  let pixMonthlyLimitPolicy: PixMonthlyLimitPolicy;
  let handler: PerformPaymentCommandHandler;

  beforeEach(() => {
    logger = { debug: vi.fn() } as unknown as ILogger;
    commandBus = { register: vi.fn() } as unknown as ICommandBus;
    paymentFactory = { createPending: vi.fn() } as unknown as PaymentFactory;
    pixApi = { retrieveDetails: vi.fn() } as unknown as IPixApi;
    pixTimeAmountPolicy = { allows: vi.fn() } as unknown as PixTimeAmountPolicy;
    pixMonthlyLimitPolicy = {
      allows: vi.fn(),
    } as unknown as PixMonthlyLimitPolicy;
    handler = new PerformPaymentCommandHandler(
      logger,
      commandBus,
      paymentFactory,
      pixApi,
      pixTimeAmountPolicy,
      pixMonthlyLimitPolicy
    );
  });

  it("should register the command on module init", () => {
    handler.onModuleInit();
    expect(commandBus.register).toHaveBeenCalledWith(
      PerformPaymentCommand,
      handler
    );
  });

  it("should handle PerformPaymentCommand successfully", async () => {
    const now = new Date();
    const command = new PerformPaymentCommand("payerId", "pixKey", 100);
    const paymentId = PaymentId.create("paymentId");
    const status = Status.pending();
    const pixKey = PixKey.create(command.pixKey);
    const payerId = PayerId.create(command.payerId);
    const amount = Amount.create(command.amount);
    const account = Account.create("account");
    const bank = Bank.create("bank");
    const paidAt = PaidAt.create(null);
    const createdAt = CreatedAt.create(now);
    const updatedAt = UpdatedAt.create(null);

    const payment = {
      paymentId,
      status,
      payerId,
      amount,
      pixKey,
      account,
      bank,
      paidAt,
      createdAt,
      updatedAt,
      commit: vi.fn(),
    } as unknown as Payment;

    vi.spyOn(pixApi, "retrieveDetails").mockResolvedValue({
      account: "account" as any,
      bank: "bank" as any,
    });
    vi.spyOn(pixTimeAmountPolicy, "allows").mockReturnValue(true);
    vi.spyOn(pixMonthlyLimitPolicy, "allows").mockResolvedValue(true);
    vi.spyOn(paymentFactory, "createPending").mockReturnValue(payment);

    const result = await handler.handle(command);

    expect(pixApi.retrieveDetails).toHaveBeenCalledWith(pixKey);
    expect(pixTimeAmountPolicy.allows).toHaveBeenCalledWith(
      amount,
      expect.any(Date)
    );
    expect(pixMonthlyLimitPolicy.allows).toHaveBeenCalledWith(
      payerId,
      amount,
      expect.any(Number),
      expect.any(Number)
    );
    expect(paymentFactory.createPending).toHaveBeenCalledWith(
      payerId,
      amount,
      pixKey,
      "account",
      "bank"
    );
    expect(payment.commit).toHaveBeenCalled();
    expect(result).toEqual({
      id: "paymentId",
      status: "pending",
      payerId: "payerId",
      amount: 100,
      pixKey: "pixKey",
      account: "account",
      bank: "bank",
      paidAt: null,
      createdAt: now.toISOString(),
      updatedAt: null,
    });
  });

  it("should throw PixPaymentNotAllowedException if policies do not allow payment", async () => {
    const command = new PerformPaymentCommand("payerId", "pixKey", 100);
    vi.spyOn(pixApi, "retrieveDetails").mockResolvedValue({
      account: "account" as any,
      bank: "bank" as any,
    });
    vi.spyOn(pixTimeAmountPolicy, "allows").mockReturnValue(false);

    await expect(handler.handle(command)).rejects.toThrow(
      PixPaymentNotAllowedException
    );
  });
});
