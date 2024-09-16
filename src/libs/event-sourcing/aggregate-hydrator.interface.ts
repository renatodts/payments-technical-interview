/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import AggregateRootStream from "@/libs/event-sourcing/aggregate-root-stream";
import StreamId from "@/libs/event-sourcing/value-objects/stream-id";

export default abstract class IAggregateHydrator {
  abstract hydrate<T extends Type<AggregateRootStream>>(
    aggregateClass: T,
    streamId: StreamId
  ): Promise<InstanceType<T>>;
}
