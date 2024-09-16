/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import Payment from "@/apps/payments/domain/payment";
import PaymentDetailsReadModel from "@/apps/payments/domain/read-models/payment-details.read-model";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";

export default abstract class IMaterializedPaymentDetailsRepository {
  abstract findById(
    paymentId: PaymentId
  ): Promise<PaymentDetailsReadModel | null>;

  abstract upsert(payment: Payment): Promise<PaymentDetailsReadModel>;
}
