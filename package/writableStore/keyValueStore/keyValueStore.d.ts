import { WritableStore } from '../writableStore.js';
interface KeyValueType<T> {
    [key: string | number | symbol]: T;
}
interface KeyValueStoreOpts<T> {
    value: KeyValueType<T>;
}
declare class KeyValueStore<T> extends WritableStore<KeyValueType<T>> {
    constructor({ value }: KeyValueStoreOpts<T>);
    _initProxy(value: KeyValueType<T>): void;
}
declare function keyValueStore<T>(value?: KeyValueType<T>): KeyValueStore<T>;
export default keyValueStore;
export { KeyValueStore };
export type { KeyValueStoreOpts, KeyValueType };
