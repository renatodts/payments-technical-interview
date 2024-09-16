/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IPixApi from "@/apps/payments/application/ports/pix-api.interface";
import { PaymentsInfrastructure } from "@/apps/payments/application/types";
import PixApiAdapter from "@/apps/payments/infrastructure/integration/pix-api/pix-api.adapter";

export const integrationInfrastructure: PaymentsInfrastructure = {
  bindings: [
    {
      bind: IPixApi,
      useClass: PixApiAdapter,
    },
  ],
};
