import { WritableStore } from '../writableStore.js';
declare type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
declare type ArrayStoreOpts<T> = {
    value: T;
};
declare class ArrayStore<T extends unknown[]> extends WritableStore<T> {
    constructor({ value }: ArrayStoreOpts<T>);
    protected _initProxy(value: T): void;
    protected _insert_index(after: boolean | undefined, needleIndex: number, ...values: T): this;
    protected _insert(after: boolean | undefined, first: boolean | undefined, needle: ArrayElement<T>, ...values: T): this;
    addAfter(needleIndex: number, ...values: T): this;
    addBefore(needleIndex: number, ...values: T): this;
    addAfterFirst(needle: ArrayElement<T>, ...values: T): this;
    addBeforeFirst(needle: ArrayElement<T>, ...values: T): this;
    addAfterLast(needle: ArrayElement<T>, ...values: T): this;
    addBeforeLast(needle: ArrayElement<T>, ...values: T): this;
    protected _remove_first_last(first: boolean, value: ArrayElement<T>): this;
    removeFirst(value: ArrayElement<T>): this;
    removeLast(value: ArrayElement<T>): this;
    removeEvery(value: ArrayElement<T>): this;
    remove(index: number): this;
    pluck(index: number): ArrayElement<T> | undefined;
}
declare function arrayStore<T extends unknown[]>(value?: T): ArrayStore<T>;
export default arrayStore;
export { ArrayStore };
export type { ArrayStoreOpts };
