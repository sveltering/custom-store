import { WritableStore } from '../writableStore.js';
declare type KeyValueType = Record<string | symbol | number, any>;
declare type KeyValueStoreOpts<T> = {
    value: T;
};
declare class KeyValueStore<T extends KeyValueType> extends WritableStore<T> {
    constructor({ value }: KeyValueStoreOpts<T>);
    _initProxy(value: T): void;
}
declare function keyValueStore<T extends KeyValueType>(value?: T): KeyValueStore<T>;
export default keyValueStore;
export { KeyValueStore };
export type { KeyValueStoreOpts };
