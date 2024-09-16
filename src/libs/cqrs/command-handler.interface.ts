/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import ICommand, { InferCommandResult } from "@/libs/cqrs/command.interface";

export default interface ICommandHandler<C extends ICommand = ICommand> {
  handle(command: C): Promise<InferCommandResult<C>>;
}
