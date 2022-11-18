import { _writableStore } from '../writableStore.js';
export declare type proxyValueType<T> = T | Array<T> | keyValueType<T> | keyValueType<proxyValueType<T>>;
export interface keyValueType<T> {
    [key: string | number | symbol]: proxyValueType<T>;
}
export interface proxyStoreOpts<T> {
    value: proxyValueType<T>;
}
export declare class _proxyStore<T> extends _writableStore<proxyValueType<T>, any> {
    constructor({ value }: proxyStoreOpts<T>);
    _initProxy(value: proxyValueType<T>): void;
}
export default function proxyStore<T>(value: proxyValueType<T>): _proxyStore<T>;
