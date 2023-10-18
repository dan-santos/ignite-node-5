import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate){
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create(){
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe('Domain events tests', () => {
  it('should be able to dispatch and listen to events', () => {
    const callBackSpy = vi.fn();

    // subscriber registered (listening the "created response" event)
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name);

    // creating response but without saving on database
    const aggregate = CustomAggregate.create();

    // ensuring that the event has created but without triggered
    expect(aggregate.domainEvents).toHaveLength(1);

    // saving response on database and triggering the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // the subscriber listen the event and executes
    expect(callBackSpy).toHaveBeenCalled();

    expect(aggregate.domainEvents).toHaveLength(0);
  });
});