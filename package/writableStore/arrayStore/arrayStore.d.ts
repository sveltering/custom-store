import { WritableStore } from '../writableStore.js';
export interface ArrayStoreOpts<T> {
    value: T[];
}
declare class ArrayStore<T> extends WritableStore<T[], T[]> {
    constructor({ value }: ArrayStoreOpts<T>);
    protected _initProxy(value: T[]): void;
}
declare function arrayStore<T>(value?: T[]): ArrayStore<T>;
export default arrayStore;
export { ArrayStore };
