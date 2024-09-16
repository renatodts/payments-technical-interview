/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IConfig from "@/libs/core/config/config.interface";
import ILogger from "@/libs/core/logger/logger.interface";
import IModuleRef from "@/libs/core/module/module-ref.interface";
import { ModuleType } from "@/libs/core/module/module.types";

export default abstract class IApplication {
  public abstract create(modules: ModuleType[]): Promise<IApplication>;
  public abstract enableShutdownHooks(): void;

  public abstract start(): Promise<IApplication>;
  public abstract stop(): Promise<IApplication>;

  public abstract getModuleRef(): IModuleRef;
  public abstract getLogger(): ILogger;
  public abstract getConfig(): IConfig;
}
