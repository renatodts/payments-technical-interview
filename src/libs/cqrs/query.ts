/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IQueryBus from "@/libs/cqrs/query-bus.interface";
import IQuery from "@/libs/cqrs/query.interface";

export default abstract class Query<Result = unknown>
  implements IQuery<Result>
{
  execute(queryBus: IQueryBus): Promise<Result> {
    return queryBus.request<Result>(this);
  }
}
