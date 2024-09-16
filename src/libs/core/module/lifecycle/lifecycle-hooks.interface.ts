/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import AfterApplicationBootstrap from "@/libs/core/module/lifecycle/after-application-bootstrap.interface";
import BeforeApplicationBootstrap from "@/libs/core/module/lifecycle/before-application-bootstrap.interface";
import BeforeApplicationShutdown from "@/libs/core/module/lifecycle/before-application-shutdown.interface";
import OnApplicationBootstrap from "@/libs/core/module/lifecycle/on-application-bootstrap.interface";
import OnApplicationShutdown from "@/libs/core/module/lifecycle/on-application-shutdown.interface";
import OnModuleInit from "@/libs/core/module/lifecycle/on-module-init.interface";

export type LifecycleHooks = OnModuleInit &
  BeforeApplicationBootstrap &
  OnApplicationBootstrap &
  AfterApplicationBootstrap &
  BeforeApplicationShutdown &
  OnApplicationShutdown;
