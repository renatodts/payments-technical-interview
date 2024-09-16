/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IQueryBus from "@/libs/cqrs/query-bus.interface";

export default interface IQuery<Result = unknown> {
  execute(queryBus: IQueryBus): Promise<Result>;
}

export type InferQueryResult<Q extends IQuery> = Q extends IQuery<infer R>
  ? R
  : never;
