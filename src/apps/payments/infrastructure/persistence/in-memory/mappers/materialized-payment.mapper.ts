/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import Payment from "@/apps/payments/domain/payment";
import MaterializedPaymentEntity from "@/apps/payments/infrastructure/persistence/in-memory/entities/materialized-payment.entity";

@injectable()
export default class MaterializedPaymentMapper {
  toPersistence(payment: Payment) {
    return new MaterializedPaymentEntity(
      payment.paymentId.toString(),
      payment.status.toString(),
      payment.payerId.toString(),
      payment.amount.toNumber(),
      payment.pixKey.toString(),
      payment.account.toString(),
      payment.bank.toString(),
      payment.paidAt.toStringOrNull(),
      payment.createdAt.toString(),
      payment.updatedAt.toStringOrNull()
    );
  }
}
