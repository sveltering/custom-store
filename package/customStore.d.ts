import type { Unsubscriber, Subscriber, Writable, Readable } from 'svelte/store';
import type subscriberStore from './readableStore/subscriberStore/subscriberStore.js';
export interface customStoreOpts<T> {
    value: T;
    isWritable?: boolean;
    hasSubscriber?: boolean;
}
export default class _customStore<T, R extends T> {
    $store: Readable<T> | Writable<T>;
    _destroys: (CallableFunction | null)[];
    _setNull: () => void;
    _unsubscribes: (Unsubscriber | null)[];
    $hasSubscriber: subscriberStore;
    constructor({ value, isWritable, hasSubscriber }: customStoreOpts<T>);
    protected _unsubscribe(index: number): void;
    subscribe(callback: Subscriber<T>): Unsubscriber;
    unsubscribeAll(): this;
    protected _runDestroys(): void;
    purge(): void;
    get(): R;
}
