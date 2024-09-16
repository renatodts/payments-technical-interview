/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import RequestBus from "@/libs/common/utils/request-bus/request-bus";
import ICommandBus from "@/libs/cqrs/command-bus.interface";
import ICommandHandler from "@/libs/cqrs/command-handler.interface";
import ICommand from "@/libs/cqrs/command.interface";

@injectable()
export default class CommandBus extends RequestBus implements ICommandBus {
  register(command: Type<ICommand>, handler: ICommandHandler): void {
    return super.register(command, handler);
  }

  execute<Result = unknown>(command: ICommand<Result>): Promise<Result> {
    return command.execute(this);
  }

  request<Result = unknown>(command: ICommand<Result>): Promise<Result> {
    return super.request<Result>(command);
  }
}
