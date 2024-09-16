/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { LifecycleHooks } from "@/libs/core/module/lifecycle/lifecycle-hooks.interface";

export type IModule = Object & Partial<LifecycleHooks>;
