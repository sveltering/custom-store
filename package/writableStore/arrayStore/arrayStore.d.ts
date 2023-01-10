import { WritableStore } from '../writableStore.js';
declare type ArrayStoreOpts<T> = {
    value: T[];
};
declare class ArrayStore<T> extends WritableStore<T[]> {
    constructor({ value }: ArrayStoreOpts<T>);
    protected _initProxy(value: T[]): void;
}
declare function arrayStore<T>(value?: T[]): ArrayStore<T>;
export default arrayStore;
export { ArrayStore };
export type { ArrayStoreOpts };
