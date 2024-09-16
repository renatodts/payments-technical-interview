/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { PaymentsInfrastructure } from "@/apps/payments/application/types";
import PaymentCompletedEventDeserializer from "@/apps/payments/infrastructure/events/deserializers/payment-completed.event-deserializer";
import PaymentCreatedEventDeserializer from "@/apps/payments/infrastructure/events/deserializers/payment-created.event-deserializer";
import PaymentStatusChangedEventDeserializer from "@/apps/payments/infrastructure/events/deserializers/payment-status-changed.event-deserializer";

export const eventsInfrastructure: PaymentsInfrastructure = {
  bindings: [
    PaymentCreatedEventDeserializer,
    PaymentStatusChangedEventDeserializer,
    PaymentCompletedEventDeserializer,
  ],
};
