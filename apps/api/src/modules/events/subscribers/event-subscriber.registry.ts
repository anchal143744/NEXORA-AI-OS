import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../contracts/domain-event.contract';

export type EventSubscriber = (event: DomainEvent) => Promise<void> | void;

@Injectable()
export class EventSubscriberRegistry {
  private readonly subscribers = new Map<string, EventSubscriber[]>();

  subscribe(eventType: string, subscriber: EventSubscriber) {
    const list = this.subscribers.get(eventType) ?? [];
    list.push(subscriber);
    this.subscribers.set(eventType, list);
  }

  async dispatch(event: DomainEvent) {
    const subscribers = [...(this.subscribers.get(event.type) ?? []), ...(this.subscribers.get('*') ?? [])];
    await Promise.all(subscribers.map((subscriber) => subscriber(event)));
  }
}
