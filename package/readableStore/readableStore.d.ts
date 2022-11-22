import CustomStore from '../CustomStore.js';
import SubscriberStore from './SubscriberStore/SubscriberStore.js';
import type { Readable } from 'svelte/store';
export interface ReadableStoreOpts<T> {
    value: T;
}
declare class ReadableStore<T> extends CustomStore<T, T> {
    $store: Readable<T>;
    $hasSubscriber: SubscriberStore;
    constructor({ value }: ReadableStoreOpts<T>);
}
declare function readableStore<T>(value: T): ReadableStore<T>;
export default readableStore;
export { ReadableStore };
