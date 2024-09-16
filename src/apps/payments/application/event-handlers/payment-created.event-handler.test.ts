/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import "reflect-metadata";
import PaymentCreatedEventHandler from "@/apps/payments/application/event-handlers/payment-created.event-handler";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import Payment from "@/apps/payments/domain/payment";
import { describe, it, vi, expect, beforeEach } from "vitest";

describe("PaymentCreatedEventHandler", () => {
  let logger: any;
  let eventBus: any;
  let aggregateHydrator: any;
  let monthlyPaymentsRepository: any;
  let handler: PaymentCreatedEventHandler;

  beforeEach(() => {
    logger = { debug: vi.fn(), error: vi.fn() };
    eventBus = { register: vi.fn() };
    aggregateHydrator = { hydrate: vi.fn() };
    monthlyPaymentsRepository = { upsert: vi.fn() };
    handler = new PaymentCreatedEventHandler(
      logger,
      eventBus,
      aggregateHydrator,
      monthlyPaymentsRepository
    );
  });

  it("should register the event handler on module init", () => {
    handler.onModuleInit();
    expect(eventBus.register).toHaveBeenCalledWith(
      PaymentCreatedEvent,
      handler
    );
  });

  it("should handle the PaymentCreatedEvent and process payment", async () => {
    const paymentId = { value: "payment-id" };
    const event = new (PaymentCreatedEvent as any)(paymentId);
    const payment = {
      paymentId: { toString: () => "payment-id" },
    };

    aggregateHydrator.hydrate.mockResolvedValue(payment);
    vi.spyOn(handler, "releaseLock" as any).mockResolvedValue(undefined);

    await handler.handle(event);

    expect(aggregateHydrator.hydrate).toHaveBeenCalledWith(Payment, paymentId);
    expect(monthlyPaymentsRepository.upsert).toHaveBeenCalledWith(payment);
    expect((handler as any).releaseLock).toHaveBeenCalledWith(payment);
  });
});
