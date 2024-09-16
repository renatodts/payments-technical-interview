/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Payment from "@/apps/payments/domain/payment";
import PayerId from "@/apps/payments/domain/value-objects/payer-id";

export default abstract class IMonthlyPaymentsRepository {
  abstract upsert(payment: Payment): Promise<void>;

  abstract findMonthlyPaymentsByPayerId(
    payerId: PayerId,
    year: number,
    month: number
  ): Promise<Payment[]>;

  abstract sumAmountByPayerId(
    payerId: PayerId,
    year: number,
    month: number
  ): Promise<number>;
}
