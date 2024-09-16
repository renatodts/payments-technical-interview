/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { IRouteAssign } from "@/libs/api-gateway/types";
import { LifecycleHooks } from "@/libs/core/module/lifecycle/lifecycle-hooks.interface";

export default abstract class IRouteRegistrar<T extends Object = never> {
  abstract register(
    target: T,
    routes: IRouteAssign<
      Exclude<MethodsOf<T> & (string | symbol), keyof LifecycleHooks>
    >[]
  ): void;
}
