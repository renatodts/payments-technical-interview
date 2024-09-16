/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { LifecycleHooks } from "@/libs/core/module/lifecycle/lifecycle-hooks.interface";

export interface BindingInput {
  bind: BindingInputToken;
  useClass: Type<unknown>;
}

export type BindingInputToken = Type<unknown> | AbstractType<unknown>;

type IBinding = Object & Partial<LifecycleHooks>;
export default IBinding;
