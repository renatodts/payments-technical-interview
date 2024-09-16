/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import { injectable } from "inversify";
import IEventPublisher from "@/libs/core/events/event-publisher.interface";
import IAggregateHydrator from "@/libs/event-sourcing/aggregate-hydrator.interface";
import AggregateRootStream from "@/libs/event-sourcing/aggregate-root-stream";
import IEventStore from "@/libs/event-sourcing/event-store.interface";
import StreamId from "@/libs/event-sourcing/value-objects/stream-id";

@injectable()
export default class AggregateHydrator implements IAggregateHydrator {
  constructor(
    private readonly eventPublisher: IEventPublisher,
    private readonly eventStore: IEventStore
  ) {}

  // In a real-world application, this method would be more complex.
  // It would have snapshot support, cache, and other optimizations.
  async hydrate<T extends Type<AggregateRootStream>>(
    aggregateClass: T,
    streamId: StreamId
  ): Promise<InstanceType<T>> {
    const mergedAggregateClass =
      this.eventPublisher.mergeClassContext(aggregateClass);
    const aggregate = new mergedAggregateClass(streamId);

    const streamEvents = await this.eventStore.getEventsByStreamId(streamId);
    aggregate.hydrate(streamEvents);

    return aggregate as InstanceType<T>;
  }
}
