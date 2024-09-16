/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import RequestBus from "@/libs/common/utils/request-bus/request-bus";
import IQueryBus from "@/libs/cqrs/query-bus.interface";
import IQueryHandler from "@/libs/cqrs/query-handler.interface";
import IQuery from "@/libs/cqrs/query.interface";

@injectable()
export default class QueryBus extends RequestBus implements IQueryBus {
  register(query: Type<IQuery>, handler: IQueryHandler): void {
    return super.register(query, handler);
  }

  execute<Result = unknown>(query: IQuery<Result>): Promise<Result> {
    return query.execute(this);
  }

  request<Result = unknown>(query: IQuery<Result>): Promise<Result> {
    return super.request<Result>(query);
  }
}
