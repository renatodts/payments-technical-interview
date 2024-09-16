/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { Container, injectable, interfaces } from "inversify";
import IInternalDependency from "@/libs/core/application/internal-dependency.interface";
import IModuleRef from "@/libs/core/module/module-ref.interface";

@injectable()
export default class ModuleRef implements IModuleRef, IInternalDependency {
  constructor(private readonly container: Container) {}

  initialize() {}

  public resolve<T>(identifier: interfaces.ServiceIdentifier<T>): T {
    return this.container.get<T>(identifier);
  }
}
