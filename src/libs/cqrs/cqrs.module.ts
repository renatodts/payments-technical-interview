/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import module from "@/libs/core/module/module.decorator";
import IQueryBus from "@/libs/cqrs/query-bus.interface";
import QueryBus from "@/libs/cqrs/query-bus";
import ICommandBus from "@/libs/cqrs/command-bus.interface";
import CommandBus from "@/libs/cqrs/command-bus";

@module({
  bindings: [
    { bind: IQueryBus, useClass: QueryBus },
    { bind: ICommandBus, useClass: CommandBus },
  ],
})
export default class CQRSModule {}
