/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { interfaces } from "inversify";

export default abstract class IModuleRef {
  abstract resolve<T>(identifier: interfaces.ServiceIdentifier<T>): T;
}
