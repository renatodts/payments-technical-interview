/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import "reflect-metadata";
import PaymentStatusChangedEventHandler from "@/apps/payments/application/event-handlers/payment-status-changed.event-handler";
import { PaymentStatusChangedEvent } from "@/apps/payments/domain/events/payment-status-changed.event";
import IEventBus from "@/libs/core/events/event-bus.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("PaymentStatusChangedEventHandler", () => {
  let logger: ILogger;
  let eventBus: IEventBus;
  let handler: PaymentStatusChangedEventHandler;

  beforeEach(() => {
    logger = { debug: vi.fn() } as unknown as ILogger;
    eventBus = { register: vi.fn() } as unknown as IEventBus;
    handler = new PaymentStatusChangedEventHandler(logger, eventBus);
  });

  it("should register the event handler on module init", () => {
    handler.onModuleInit();
    expect(eventBus.register).toHaveBeenCalledWith(
      PaymentStatusChangedEvent,
      handler
    );
  });

  it("should return a resolved promise when handling the event", async () => {
    const event = new (PaymentStatusChangedEvent as any)(
      "payment123",
      "pending",
      "completed"
    );
    await expect(handler.handle(event)).resolves.toBeUndefined();
  });
});
