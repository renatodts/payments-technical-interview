/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { describe, it, expect } from "vitest";
import GetPaymentDetailsQuery from "@/apps/payments/application/queries/get-payments-details.query";

describe("GetPaymentDetailsQuery", () => {
  it("should create an instance with the given paymentId", () => {
    const paymentId = "12345";
    const query = new GetPaymentDetailsQuery(paymentId);
    expect(query).toBeInstanceOf(GetPaymentDetailsQuery);
    expect(query.paymentId).toBe(paymentId);
  });
});
