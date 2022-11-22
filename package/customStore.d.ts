import type { Unsubscriber, Subscriber, Writable, Readable } from 'svelte/store';
import type SubscriberStore from './readableStore/SubscriberStore/SubscriberStore.js';
interface CustomStoreOpts<T> {
    value: T;
    isWritable?: boolean;
    hasSubscriber?: boolean;
}
declare class CustomStore<T, R = T> {
    $store: Readable<T> | Writable<T>;
    _destroys: (CallableFunction | null)[];
    _setNull: () => void;
    _unsubscribes: (Unsubscriber | null)[];
    $hasSubscriber: SubscriberStore;
    constructor({ value, isWritable, hasSubscriber }: CustomStoreOpts<T>);
    protected _unsubscribe(index: number): void;
    subscribe(callback: Subscriber<T>): Unsubscriber;
    unsubscribeAll(): this;
    protected _runDestroys(): void;
    purge(): void;
    get(): R;
}
export default CustomStore;
export type { CustomStoreOpts };
