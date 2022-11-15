import type { Writable } from 'svelte/store';
import customStore from '../../customStore.js';
import type _customStore from '../../customStore.js';

export interface subscriberStoreConstructorOpts<T> {
	value: boolean;
	_this: _customStore<T>;
}
export default class subscriberStore<T> extends customStore<boolean> {
	declare $store: Writable<boolean>;
	constructor({ value, _this }: subscriberStoreConstructorOpts<T>) {
		super({ value });
		this._destroys.push(() => _this.$hasSubscriber.purge());
		return this;
	}
}
