/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { PaymentsInfrastructure } from "@/apps/payments/application/types";
import { eventsInfrastructure } from "@/apps/payments/infrastructure/events/events.infrastructure";
import { integrationInfrastructure } from "@/apps/payments/infrastructure/integration/integration.infrastructure";
import { inMemoryPersistenceInfrastructure } from "@/apps/payments/infrastructure/persistence/in-memory/in-memory-persistence.infrastructure";

export const paymentsInfrastructure: PaymentsInfrastructure = {
  bindings: [
    ...(eventsInfrastructure.bindings ?? []),
    ...(integrationInfrastructure.bindings ?? []),
    ...(inMemoryPersistenceInfrastructure.bindings ?? []), //
  ],
};
