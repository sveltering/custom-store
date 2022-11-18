import _customStore from '../customStore.js';
import subscriberStore from './subscriberStore/subscriberStore.js';
import type { Readable } from 'svelte/store';
export interface readableStoreOpts<T> {
    value: T;
}
export declare class _readableStore<T> extends _customStore<T, T> {
    $store: Readable<T>;
    $hasSubscriber: subscriberStore;
    constructor({ value }: readableStoreOpts<T>);
}
export default function readableStore<T>(value: T): _readableStore<T>;
