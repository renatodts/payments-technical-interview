/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import ICommandHandler from "@/libs/cqrs/command-handler.interface";
import ICommand from "@/libs/cqrs/command.interface";

export default abstract class ICommandBus {
  abstract register(command: Type<ICommand>, handler: ICommandHandler): void;

  abstract execute<Result = unknown>(
    command: ICommand<Result>
  ): Promise<Result>;

  abstract request<Result = unknown>(
    command: ICommand<Result>
  ): Promise<Result>;
}
