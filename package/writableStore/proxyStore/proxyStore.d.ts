import { WritableStore } from '../writableStore.js';
export declare type ProxyValueType<T> = T | Array<T> | KeyValueType<T> | KeyValueType<ProxyValueType<T>>;
export interface KeyValueType<T> {
    [key: string | number | symbol]: ProxyValueType<T>;
}
export interface ProxyStoreOpts<T> {
    value: ProxyValueType<T>;
}
declare class ProxyStore<T> extends WritableStore<ProxyValueType<T>, any> {
    constructor({ value }: ProxyStoreOpts<T>);
    _initProxy(value: ProxyValueType<T>): void;
}
declare function proxyStore<T>(value: ProxyValueType<T>): ProxyStore<T>;
export default proxyStore;
export { ProxyStore };
