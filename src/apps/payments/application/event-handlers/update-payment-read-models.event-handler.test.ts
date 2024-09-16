/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import "reflect-metadata";
import UpdatePaymentReadModelsEventHandler from "@/apps/payments/application/event-handlers/update-payment-read-models.event-handler";
import IMaterializedPaymentDetailsRepository from "@/apps/payments/application/ports/materialized-payments-details-repository.interface";
import { PaymentCompletedEvent } from "@/apps/payments/domain/events/payment-completed.event";
import { PaymentCreatedEvent } from "@/apps/payments/domain/events/payment-created.event";
import { PaymentStatusChangedEvent } from "@/apps/payments/domain/events/payment-status-changed.event";
import Payment from "@/apps/payments/domain/payment";
import IEventBus from "@/libs/core/events/event-bus.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import IAggregateHydrator from "@/libs/event-sourcing/aggregate-hydrator.interface";
import { describe, it, beforeEach, vi, expect, Mock } from "vitest";

describe("UpdatePaymentReadModelsEventHandler", () => {
  let logger: ILogger;
  let eventBus: IEventBus;
  let aggregateHydrator: IAggregateHydrator;
  let materializedPaymentDetailsRepository: IMaterializedPaymentDetailsRepository;
  let handler: UpdatePaymentReadModelsEventHandler;

  beforeEach(() => {
    logger = { debug: vi.fn() } as unknown as ILogger;
    eventBus = { register: vi.fn() } as unknown as IEventBus;
    aggregateHydrator = { hydrate: vi.fn() } as unknown as IAggregateHydrator;
    materializedPaymentDetailsRepository = {
      upsert: vi.fn(),
    } as unknown as IMaterializedPaymentDetailsRepository;

    handler = new UpdatePaymentReadModelsEventHandler(
      logger,
      eventBus,
      aggregateHydrator,
      materializedPaymentDetailsRepository
    );
  });

  it("should register events on module init", () => {
    handler.onModuleInit();
    expect(eventBus.register).toHaveBeenCalledWith(
      PaymentCreatedEvent,
      handler
    );
    expect(eventBus.register).toHaveBeenCalledWith(
      PaymentStatusChangedEvent,
      handler
    );
    expect(eventBus.register).toHaveBeenCalledWith(
      PaymentCompletedEvent,
      handler
    );
  });

  it("should handle PaymentCreatedEvent and update read models", async () => {
    const event = new (PaymentCreatedEvent as any)({ value: "123" });
    const payment = new (Payment as any)();

    (aggregateHydrator.hydrate as Mock).mockResolvedValue(payment);

    await handler.handle(event);

    expect(aggregateHydrator.hydrate).toHaveBeenCalledWith(
      Payment,
      event.paymentId
    );
    expect(materializedPaymentDetailsRepository.upsert).toHaveBeenCalledWith(
      payment
    );
  });

  it("should handle PaymentStatusChangedEvent and update read models", async () => {
    const event = new (PaymentStatusChangedEvent as any)({ value: "456" });
    const payment = new (Payment as any)();

    (aggregateHydrator.hydrate as Mock).mockResolvedValue(payment);

    await handler.handle(event);

    expect(aggregateHydrator.hydrate).toHaveBeenCalledWith(
      Payment,
      event.paymentId
    );
    expect(materializedPaymentDetailsRepository.upsert).toHaveBeenCalledWith(
      payment
    );
  });

  it("should handle PaymentCompletedEvent and update read models", async () => {
    const event = new (PaymentCompletedEvent as any)({ value: "789" });
    const payment = new (Payment as any)();

    (aggregateHydrator.hydrate as Mock).mockResolvedValue(payment);

    await handler.handle(event);

    expect(aggregateHydrator.hydrate).toHaveBeenCalledWith(
      Payment,
      event.paymentId
    );
    expect(materializedPaymentDetailsRepository.upsert).toHaveBeenCalledWith(
      payment
    );
  });
});
