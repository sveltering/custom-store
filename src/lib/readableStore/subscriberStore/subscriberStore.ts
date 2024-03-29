import CustomStore from '../../CustomStore.js';
import type { Writable } from 'svelte/store';

type SubscriberStoreOpts = {
	value: boolean;
	_this: CustomStore<unknown>;
};
class SubscriberStore extends CustomStore<boolean> {
	declare $store: Writable<boolean>;
	constructor({ value, _this }: SubscriberStoreOpts) {
		super({ value });
		this._destroys.push(() => _this.$hasSubscriber.purge());
		return this;
	}
}

export default SubscriberStore;
export type { SubscriberStoreOpts };
