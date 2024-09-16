/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import "reflect-metadata";
import GetPaymentDetailsQuery from "@/apps/payments/application/queries/get-payments-details.query";
import GetPaymentsDetailsQueryHandler from "@/apps/payments/application/queries/get-payments-details.query-handler";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import NotFoundException from "@/libs/common/exceptions/not-found.exception";
import { describe, it, expect, vi } from "vitest";

describe("GetPaymentsDetailsQueryHandler", () => {
  const logger = { debug: vi.fn() };
  const queryBus = { register: vi.fn() };
  const materializedPaymentDetailsRepository = { findById: vi.fn() };

  const handler = new (GetPaymentsDetailsQueryHandler as any)(
    logger,
    queryBus,
    materializedPaymentDetailsRepository
  );

  it("should return payment details when payment is found", async () => {
    const paymentId = "123";
    const query = new GetPaymentDetailsQuery(paymentId);
    const paymentDetails = { id: paymentId, amount: 100 };

    materializedPaymentDetailsRepository.findById.mockResolvedValue(
      paymentDetails
    );

    const result = await handler.handle(query);

    expect(result).toEqual(paymentDetails);
    expect(materializedPaymentDetailsRepository.findById).toHaveBeenCalledWith(
      PaymentId.create(paymentId)
    );
  });

  it("should throw NotFoundException when payment is not found", async () => {
    const paymentId = "123";
    const query = new GetPaymentDetailsQuery(paymentId);

    materializedPaymentDetailsRepository.findById.mockResolvedValue(null);

    await expect(handler.handle(query)).rejects.toThrow(NotFoundException);
    expect(materializedPaymentDetailsRepository.findById).toHaveBeenCalledWith(
      PaymentId.create(paymentId)
    );
  });
});
