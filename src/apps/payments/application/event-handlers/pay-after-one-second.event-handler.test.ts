/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import "reflect-metadata";
import PayAfterOneSecondEventHandler from "@/apps/payments/application/event-handlers/pay-after-one-second.event-handler";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import Payment from "@/apps/payments/domain/payment";
import PaidAt from "@/apps/payments/domain/value-objects/paid-at";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import { describe, it, vi, expect, beforeEach } from "vitest";

describe("PayAfterOneSecondEventHandler", () => {
  let logger: any;
  let eventBus: any;
  let aggregateHydrator: any;
  let handler: PayAfterOneSecondEventHandler;

  beforeEach(() => {
    logger = { debug: vi.fn(), error: vi.fn() };
    eventBus = { register: vi.fn() };
    aggregateHydrator = { hydrate: vi.fn() };
    handler = new PayAfterOneSecondEventHandler(
      logger,
      eventBus,
      aggregateHydrator
    );
  });

  it("should register the event handler on module init", () => {
    handler.onModuleInit();
    expect(eventBus.register).toHaveBeenCalledWith(
      PaymentCreatedEvent,
      handler
    );
  });

  it("should handle the PaymentCreatedEvent and mark payment as paid", async () => {
    const paymentId = { value: "payment-id" } as PaymentId;
    const event = new (PaymentCreatedEvent as any)(paymentId);
    const payment = {
      paid: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
      paymentId: { toString: () => "payment-id" },
    };

    aggregateHydrator.hydrate.mockResolvedValue(payment);

    vi.useFakeTimers();
    await handler.handle(event);

    expect(aggregateHydrator.hydrate).toHaveBeenCalledWith(Payment, paymentId);

    vi.advanceTimersByTime(1000);
    expect(payment.paid).toHaveBeenCalledWith(expect.any(PaidAt));
    expect(payment.commit).toHaveBeenCalled();
  });
});
