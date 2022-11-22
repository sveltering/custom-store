import CustomStore from '../../CustomStore.js';
import type { Writable } from 'svelte/store';
interface SubscriberStoreOpts {
    value: boolean;
    _this: CustomStore<unknown, unknown>;
}
declare class SubscriberStore extends CustomStore<boolean, boolean> {
    $store: Writable<boolean>;
    constructor({ value, _this }: SubscriberStoreOpts);
}
export default SubscriberStore;
