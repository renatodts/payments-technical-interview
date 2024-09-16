/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import ICommandBus from "@/libs/cqrs/command-bus.interface";
import ICommand from "@/libs/cqrs/command.interface";

export default abstract class Command<Result = unknown>
  implements ICommand<Result>
{
  execute(commandBus: ICommandBus): Promise<Result> {
    return commandBus.request<Result>(this);
  }
}
