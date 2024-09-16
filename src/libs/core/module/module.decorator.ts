/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import {
  BindingInput,
  BindingInputToken,
} from "@/libs/core/module/binding.interface";
import { MODULE_OPTIONS } from "@/libs/core/module/constants";
import { ModuleOptions } from "@/libs/core/module/module.types";

export type ModuleDecoratorOptions = Omit<ModuleOptions, "bindings"> & {
  controllers?: (BindingInput | BindingInputToken)[];
  bindings?: (BindingInput | BindingInputToken)[];
};

// Decorator to define a module.
export default function module(
  options: ModuleDecoratorOptions = {}
): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(
      MODULE_OPTIONS,
      parseDecoratorOptions(options),
      target
    );

    injectable()(target as Type<Object>);
  };
}

// Transform tokens to valid bindings inputs.
function parseDecoratorOptions(options: ModuleDecoratorOptions): ModuleOptions {
  // Merge controllers and bindings into bindings,
  // because my implementation of the module decorator
  // does not have a controllers property.
  const bindings: (BindingInput | BindingInputToken)[] = [
    ...(options.controllers || []),
    ...(options.bindings || []),
  ];

  return {
    ...options,
    bindings: bindings.map((binding) =>
      typeof binding === "function"
        ? {
            bind: binding,
            useClass: binding,
          }
        : binding
    ) as BindingInput[],
  };
}
