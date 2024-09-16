/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import CoreModule from "@/libs/core/core.module";
import ApiGatewayModule from "@/libs/api-gateway/api-gateway.module";
import EventSourcingModule from "@/libs/event-sourcing/event-sourcing.module";
import CQRSModule from "@/libs/cqrs/cqrs.module";
import PaymentsModule from "@/apps/payments/payments.module";

export default [
  CoreModule,
  ApiGatewayModule,
  EventSourcingModule,
  CQRSModule,

  // Apps
  PaymentsModule,
];
