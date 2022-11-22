import customStore from '../../customStore.js';
import type { Writable } from 'svelte/store';

interface SubscriberStoreOpts {
	value: boolean;
	_this: customStore<unknown, unknown>;
}
export default class subscriberStore extends customStore<boolean, boolean> {
	declare $store: Writable<boolean>;
	constructor({ value, _this }: SubscriberStoreOpts) {
		super({ value });
		this._destroys.push(() => _this.$hasSubscriber.purge());
		return this;
	}
}