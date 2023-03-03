import { WritableStore } from '../writableStore.js';
declare type ArrayStoreOpts<T> = {
    value: T[];
};
declare class ArrayStore<T> extends WritableStore<T[]> {
    constructor({ value }: ArrayStoreOpts<T>);
    protected _initProxy(value: T[]): void;
    protected _insert_index(after: boolean | undefined, needleIndex: number, ...values: T[]): this;
    protected _insert(after: boolean | undefined, first: boolean | undefined, needle: T, ...values: T[]): this;
    addAfter(needleIndex: number, ...values: T[]): this;
    addBefore(needleIndex: number, ...values: T[]): this;
    addAfterFirst(needle: T, ...values: T[]): this;
    addBeforeFirst(needle: T, ...values: T[]): this;
    addAfterLast(needle: T, ...values: T[]): this;
    addBeforeLast(needle: T, ...values: T[]): this;
    protected _remove_first_last(first: boolean, value: T): this;
    removeFirst(value: T): this;
    removeLast(value: T): this;
    removeEvery(value: T): this;
    remove(index: number): this;
    pluck(index: number): T | undefined;
}
declare function arrayStore<T>(value?: T[]): ArrayStore<T>;
export default arrayStore;
export { ArrayStore };
export type { ArrayStoreOpts };
