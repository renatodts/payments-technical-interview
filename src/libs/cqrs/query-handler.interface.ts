/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IQuery, { InferQueryResult } from "@/libs/cqrs/query.interface";

export default interface IQueryHandler<Q extends IQuery = IQuery> {
  handle(query: Q): Promise<InferQueryResult<Q>>;
}
