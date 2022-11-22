import { WritableStore } from '../writableStore.js';
export interface KeyValueType<T> {
    [key: string | number | symbol]: T;
}
export interface keyValueStoreOpts<T> {
    value: KeyValueType<T>;
}
declare class KeyValueStore<T> extends WritableStore<KeyValueType<T>, KeyValueType<T>> {
    constructor({ value }: keyValueStoreOpts<T>);
    _initProxy(value: KeyValueType<T>): void;
}
declare function keyValueStore<T>(value?: KeyValueType<T>): KeyValueStore<T>;
export default keyValueStore;
export { KeyValueStore };
