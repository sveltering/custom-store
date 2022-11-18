import { _writableStore } from '../writableStore.js';
export interface arrayStoreOpts<T> {
    value: T[];
}
declare class _arrayStore<T> extends _writableStore<T[], T[]> {
    constructor({ value }: arrayStoreOpts<T>);
    protected _initProxy(value: T[]): void;
}
export default function arrayStore<T>(value?: T[]): _arrayStore<T>;
export {};
