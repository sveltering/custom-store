import _customStore from '../customStore.js';
import subscriberStore from '../readableStore/subscriberStore/subscriberStore.js';
import type { Writable, Updater } from 'svelte/store';
export interface writableStoreOpts<T> {
    value: T;
}
export declare class _writableStore<T, R extends T> extends _customStore<T, R> {
    $store: Writable<T>;
    $hasSubscriber: subscriberStore;
    _proxy: {
        value: R;
    };
    constructor({ value }: writableStoreOpts<T>);
    protected _initProxy(value: T): void;
    set value(value: T);
    get value(): R;
    set(value: T): this;
    update(callable: Updater<T>): this;
}
export default function writableStore<T>(value: T): _writableStore<T, T>;
