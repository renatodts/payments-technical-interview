/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { BindingInput } from "@/libs/core/module/binding.interface";

export interface ModuleOptions {
  bindings?: BindingInput[];
}

export type ModuleType = Type<unknown>;
