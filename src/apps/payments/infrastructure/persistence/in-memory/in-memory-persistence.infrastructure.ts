/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IMaterializedPaymentDetailsRepository from "@/apps/payments/application/ports/materialized-payments-details-repository.interface";
import { PaymentsInfrastructure } from "@/apps/payments/application/types";
import IMonthlyPaymentsRepository from "@/apps/payments/domain/repositories/monthly-payments-repository.interface";
import MaterializedPaymentMapper from "@/apps/payments/infrastructure/persistence/in-memory/mappers/materialized-payment.mapper";
import InMemoryMaterializedPaymentDetailsRepository from "@/apps/payments/infrastructure/persistence/in-memory/repositories/in-memory-materialized-payments-details.repository";
import InMemoryMonthlyPaymentsRepository from "@/apps/payments/infrastructure/persistence/in-memory/repositories/in-memory-monthly-payments.repository";

export const inMemoryPersistenceInfrastructure: PaymentsInfrastructure = {
  bindings: [
    MaterializedPaymentMapper,
    {
      bind: IMaterializedPaymentDetailsRepository,
      useClass: InMemoryMaterializedPaymentDetailsRepository,
    },
    {
      bind: IMonthlyPaymentsRepository,
      useClass: InMemoryMonthlyPaymentsRepository,
    },
  ],
};
