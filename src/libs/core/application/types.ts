/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IBinding from "@/libs/core/module/binding.interface";
import { IModule } from "@/libs/core/module/module.interface";
import { ModuleOptions, ModuleType } from "@/libs/core/module/module.types";

export type ModuleDescriptor<T extends IModule = IModule> = {
  type: ModuleType;
  options: ModuleOptions;
  instance: T;
  bindings: IBinding[];
};
