/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { Container } from "inversify";
import IApplication from "./application.interface";
import { ModuleDescriptor } from "./types";
import { BindingInput } from "../module/binding.interface";
import ModuleRef from "../module/module-ref";
import ILogger from "../../core/logger/logger.interface";
import IConfig from "../../core/config/config.interface";
import Config from "../../core/config/config";
import Logger from "../../core/logger/logger";
import IInternalDependency from "./internal-dependency.interface";
import IModuleRef from "@/libs/core/module/module-ref.interface";
import { ModuleOptions, ModuleType } from "@/libs/core/module/module.types";
import { MODULE_OPTIONS } from "@/libs/core/module/constants";
import { LifecycleHooks } from "@/libs/core/module/lifecycle/lifecycle-hooks.interface";

export default class Application implements IApplication {
  private static instance: Application;
  private static container: Container;

  private initialized = false;
  private shutdownRequested = false;

  private moduleRef!: IModuleRef;
  private logger!: ILogger;
  private config!: IConfig;

  private modulesDescriptors: ModuleDescriptor[] = [];

  private constructor() {}

  // This is a private constructor to avoid external instantiation.
  public static getInstance(): IApplication {
    if (!Application.instance) {
      Application.instance = new Application();
      Application.container = new Container();
    }

    return Application.instance;
  }

  getModuleRef(): IModuleRef {
    return this.moduleRef;
  }

  getLogger(): ILogger {
    return this.logger;
  }

  getConfig(): IConfig {
    return this.config;
  }

  // This method is used to initialize the application with all its modules.
  public async create(modulesTypes: ModuleType[]): Promise<Application> {
    if (this.initialized) {
      throw new Error("Application already initialized");
    }
    this.initialized = true;

    await this.initializeInternalDependencies();

    this.logger.info("[APPLICATION] Initializing application");

    const moduleDescriptors: ModuleDescriptor[] = [];

    for (const moduleType of modulesTypes) {
      moduleDescriptors.push(this.bindModule(moduleType));
    }

    this.modulesDescriptors = moduleDescriptors;

    this.createInstances();

    await this.dispatchLifecycleHook("onModuleInit");

    return this;
  }

  // This method is used to initialize internal dependencies.
  private async initializeInternalDependencies() {
    this.moduleRef = await this.initializeInternalDependency(
      IModuleRef,
      new ModuleRef(Application.container)
    );

    this.logger = await this.initializeInternalDependency(
      ILogger,
      new Logger()
    );

    this.config = await this.initializeInternalDependency(
      IConfig,
      new Config()
    );
  }

  // This method is used to initialize an internal dependency.
  private async initializeInternalDependency<T extends AbstractType>(
    bind: T,
    dependency: IInternalDependency
  ): Promise<InstanceType<T>> {
    await dependency.initialize();

    Application.container //
      .bind(bind)
      .toConstantValue(dependency);

    return dependency as InstanceType<T>;
  }

  // This method is used to bind a module and its bindings.
  private bindModule(moduleType: ModuleType): ModuleDescriptor {
    const options: ModuleOptions | undefined = Reflect.getOwnMetadata(
      MODULE_OPTIONS,
      moduleType
    );
    if (!options) {
      throw new Error(`${moduleType.name} isn't a module.`);
    }

    const moduleDescriptor: Partial<ModuleDescriptor> = {
      type: moduleType,
      options,
      instance: undefined,
      bindings: undefined,
    };

    // Bind the bindings.
    this.bindModuleBindings(options.bindings || []);

    // Bind the module instance after binding its bindings.
    Application.container.bind(moduleType).toSelf().inSingletonScope();

    return moduleDescriptor as ModuleDescriptor;
  }

  // This method is used to bind the bindings for a module.
  private bindModuleBindings(bindings: BindingInput[]): void {
    // Register all bindings from the module.
    for (const { bind, useClass: bindingClass } of bindings) {
      Application.container.bind(bind).to(bindingClass).inSingletonScope();
    }
  }

  // This method is used to create instances for all modules.
  private createInstances() {
    for (const moduleDescriptor of this.modulesDescriptors) {
      moduleDescriptor.instance = Application.container.get<
        typeof moduleDescriptor.type
      >(moduleDescriptor.type);

      moduleDescriptor.bindings = (moduleDescriptor.options.bindings || []).map(
        (binding) => Application.container.get(binding.bind)
      );
    }
  }

  private async dispatchLifecycleHook(
    hook: keyof LifecycleHooks,
    afterEach?: (moduleDescriptor: ModuleDescriptor) => void | Promise<void>
  ) {
    for (const moduleDescriptor of this.modulesDescriptors) {
      // First call the hook on the bindings.
      for (const binding of moduleDescriptor.bindings) {
        await binding[hook]?.();
      }

      // Then call the hook on the module.
      await moduleDescriptor.instance[hook]?.();

      await afterEach?.(moduleDescriptor);
    }
  }

  // This method is used to start the application and all its modules.
  public async start(): Promise<Application> {
    if (!this.initialized) {
      throw new Error("Application not initialized");
    }

    this.logger.info("[APPLICATION] Starting modules");

    // Execute logic before the application starts.
    await this.dispatchLifecycleHook("beforeApplicationBootstrap");

    // Start all modules, bindings and so on.
    await this.dispatchLifecycleHook(
      "onApplicationBootstrap",
      (moduleDescriptor) =>
        this.logger.info(`[APPLICATION] ${moduleDescriptor.type.name} started`)
    );

    // Execute logic after the application starts.
    await this.dispatchLifecycleHook("afterApplicationBootstrap");

    this.logger.info(
      `[APPLICATION] ${this.logger.bold(
        this.logger.greenBright("Application started successfully")
      )}`
    );

    return this;
  }

  // This method is used to stop the application and all its modules.
  public async stop(): Promise<Application> {
    this.logger.info("[APPLICATION] Stopping application");

    await this.dispatchLifecycleHook("beforeApplicationShutdown");

    await this.dispatchLifecycleHook(
      "onApplicationShutdown",
      (moduleDescriptor) =>
        this.logger.info(`[APPLICATION] ${moduleDescriptor.type.name} stopped`)
    );

    this.logger.info("[APPLICATION] Application stopped");

    return this;
  }

  // This method is used to enable shutdown hooks.
  public enableShutdownHooks(): void {
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
      process.on(signal, this.handleShutdownHook.bind(this))
    );
  }

  // This method is used to handle shutdown hooks.
  private handleShutdownHook() {
    if (this.shutdownRequested) {
      return;
    }
    this.shutdownRequested = true;

    return this.stop()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        // If an error occurs, log it and exit the process with an error code.
        this.logger.error(error);

        process.exit(1);
      });
  }
}
