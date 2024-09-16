/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import AggregateRootStream from "@/libs/event-sourcing/aggregate-root-stream";
import StreamEvent from "@/libs/event-sourcing/stream-event.abstract";

export type LocalHandler = (event: StreamEvent) => void;
export type LocalHandlers = Record<string, LocalHandler>;

export type LocalHandlerName<
  T extends AggregateRootStream = AggregateRootStream
> = Exclude<MethodsOf<T>, MethodsOf<AggregateRootStream>>;

export type LocalHandlersMap<
  T extends AggregateRootStream = AggregateRootStream
> = Map<Type<StreamEvent>, LocalHandlerName<T>>;
