/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IMaterializedPaymentDetailsRepository from "@/apps/payments/application/ports/materialized-payments-details-repository.interface";
import GetPaymentDetailsQuery, {
  GetPaymentDetailsResult,
} from "@/apps/payments/application/queries/get-payments-details.query";
import PaymentId from "@/apps/payments/domain/value-objects/payment-id";
import NotFoundException from "@/libs/common/exceptions/not-found.exception";
import ILogger from "@/libs/core/logger/logger.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";
import IQueryBus from "@/libs/cqrs/query-bus.interface";
import IQueryHandler from "@/libs/cqrs/query-handler.interface";

@injectable()
export default class GetPaymentsDetailsQueryHandler
  implements IQueryHandler<GetPaymentDetailsQuery>, OnModuleInit
{
  constructor(
    private readonly logger: ILogger,
    private readonly queryBus: IQueryBus,
    private readonly materializedPaymentDetailsRepository: IMaterializedPaymentDetailsRepository
  ) {}

  onModuleInit() {
    // I could implement a decorator to assign queries to handlers,
    // but I'm doing it manually for the sake of simplicity.
    this.queryBus.register(GetPaymentDetailsQuery, this);
  }

  async handle(
    query: GetPaymentDetailsQuery
  ): Promise<GetPaymentDetailsResult> {
    this.logger.debug("[QUERYHANDLER] GetPaymentDetailsQuery...");

    const paymentId = PaymentId.create(query.paymentId);

    const payment = await this.materializedPaymentDetailsRepository.findById(
      paymentId
    );

    if (!payment) {
      throw new NotFoundException(`Payment not found: ${paymentId.value}`);
    }

    return payment;
  }
}
