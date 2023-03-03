import { WritableStore } from '../writableStore.js';
declare type ProxyStoreOpts<T> = {
    value: T;
};
declare class ProxyStore<T extends object> extends WritableStore<T> {
    constructor({ value }: ProxyStoreOpts<T>);
    _initProxy(value: T): void;
}
declare function proxyStore<T extends object>(value?: T): ProxyStore<T>;
export default proxyStore;
export { ProxyStore };
export type { ProxyStoreOpts };
