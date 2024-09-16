/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IMaterializedPaymentDetailsRepository from "@/apps/payments/application/ports/materialized-payments-details-repository.interface";
import Payment from "@/apps/payments/domain/payment";
import PaymentDetailsReadModel from "@/apps/payments/domain/read-models/payment-details.read-model";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import MaterializedPaymentMapper from "@/apps/payments/infrastructure/persistence/in-memory/mappers/materialized-payment.mapper";
import ILogger from "@/libs/core/logger/logger.interface";

@injectable()
export default class InMemoryMaterializedPaymentDetailsRepository
  implements IMaterializedPaymentDetailsRepository
{
  constructor(
    private readonly logger: ILogger,
    private materializedPaymentMapper: MaterializedPaymentMapper
  ) {}

  private paymentsMap: Map<string, PaymentDetailsReadModel> = new Map();

  findById(paymentId: PaymentId): Promise<PaymentDetailsReadModel | null> {
    const payment = this.paymentsMap.get(paymentId.value);

    return Promise.resolve(payment ?? null);
  }

  upsert(payment: Payment): Promise<PaymentDetailsReadModel> {
    this.logger.debug(
      `[MATERIALIZED] Upserting payment details for payment with ID: ${payment.paymentId.value}`
    );

    const readModel = this.materializedPaymentMapper.toPersistence(payment);

    this.paymentsMap.set(readModel.id, readModel);

    return Promise.resolve(readModel);
  }
}
