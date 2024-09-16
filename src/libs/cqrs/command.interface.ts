/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import ICommandBus from "@/libs/cqrs/command-bus.interface";

export default interface ICommand<Result = unknown> {
  execute(commandBus: ICommandBus): Promise<Result>;
}

export type InferCommandResult<C extends ICommand> = C extends ICommand<infer R>
  ? R
  : never;
