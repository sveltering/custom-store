import CustomStore from '../CustomStore.js';
import SubscriberStore from '../readableStore/SubscriberStore/SubscriberStore.js';
import type { Writable, Updater } from 'svelte/store';
declare type WritableStoreOpts<T> = {
    value: T;
};
declare class WritableStore<T> extends CustomStore<T> {
    $store: Writable<T>;
    $hasSubscriber: SubscriberStore;
    _proxy: {
        value: T;
    };
    constructor({ value }: WritableStoreOpts<T>);
    protected _initProxy(value: T): void;
    set value(value: T);
    get value(): T;
    set(value: T): this;
    update(callable: Updater<T>): this;
}
declare function writableStore<T>(value: T): WritableStore<T>;
export default writableStore;
export { WritableStore };
export type { WritableStoreOpts };
