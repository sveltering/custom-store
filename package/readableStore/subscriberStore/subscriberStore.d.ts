import CustomStore from '../../CustomStore.js';
import type { Writable } from 'svelte/store';
declare type SubscriberStoreOpts = {
    value: boolean;
    _this: CustomStore<unknown>;
};
declare class SubscriberStore extends CustomStore<boolean> {
    $store: Writable<boolean>;
    constructor({ value, _this }: SubscriberStoreOpts);
}
export default SubscriberStore;
export type { SubscriberStoreOpts };
