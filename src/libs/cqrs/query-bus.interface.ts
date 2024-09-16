/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import IQueryHandler from "@/libs/cqrs/query-handler.interface";
import IQuery from "@/libs/cqrs/query.interface";

export default abstract class IQueryBus {
  abstract register(query: Type<IQuery>, handler: IQueryHandler): void;

  abstract execute<Result = unknown>(query: IQuery<Result>): Promise<Result>;

  abstract request<Result = unknown>(query: IQuery<Result>): Promise<Result>;
}
