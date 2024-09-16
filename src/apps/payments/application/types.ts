/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { ModuleDecoratorOptions } from "@/libs/core/module/module.decorator";

export type PaymentsInfrastructure = {
  bindings: ModuleDecoratorOptions["bindings"];
};

export type PaymentsPresentation = {
  controllers?: ModuleDecoratorOptions["controllers"];
  bindings: ModuleDecoratorOptions["bindings"];
};
