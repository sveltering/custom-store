import { _writableStore } from '../writableStore.js';
export interface keyValueType<T> {
    [key: string | number | symbol]: T | keyValueType<T>;
}
export interface keyValueStoreOpts<T> {
    value: keyValueType<T>;
}
declare class _keyValueStore<T> extends _writableStore<keyValueType<T>, keyValueType<T>> {
    constructor({ value }: keyValueStoreOpts<T>);
    _initProxy(value: keyValueType<T>): void;
}
export default function keyValueStore<T>(value?: keyValueType<T>): _keyValueStore<T>;
export {};
