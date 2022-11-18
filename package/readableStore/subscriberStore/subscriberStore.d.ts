import customStore from '../../customStore.js';
import type { Writable } from 'svelte/store';
interface subscriberStoreOpts {
    value: boolean;
    _this: customStore<unknown, unknown>;
}
export default class subscriberStore extends customStore<boolean, boolean> {
    $store: Writable<boolean>;
    constructor({ value, _this }: subscriberStoreOpts);
}
export {};
