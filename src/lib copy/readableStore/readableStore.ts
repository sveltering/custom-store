import _customStore from '../customStore.js';
import type CustomStore from '../customStore.js';
import subscriberStore from './subscriberStore/subscriberStore.js';
import type { Readable } from 'svelte/store';

export interface ReadableStore<T> extends CustomStore<T, T> {
	$store: Readable<T>;
}

export interface readableStoreOpts<T> {
	value: T;
}

export class _readableStore<T> extends _customStore<T, T> implements ReadableStore<T> {
	declare $store: Readable<T>;
	$hasSubscriber: subscriberStore;
	constructor({ value }: readableStoreOpts<T>) {
		super({ value, hasSubscriber: true });
		this.$hasSubscriber = new subscriberStore({ value: false, _this: this });
		return this;
	}
}
export default function readableStore<T>(value: T): _readableStore<T> {
	return new _readableStore({ value });
}
