/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import { CONTROLLER_OPTIONS } from "@/libs/api-gateway/constants";

// Decorator to define a controller.
export default function controller(): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(CONTROLLER_OPTIONS, {}, target);

    injectable()(target as Type<Object>);
  };
}
