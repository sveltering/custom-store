import _customStore from '../customStore.js';
import subscriberStore from './subscriberStore/subscriberStore.js';
import { get } from 'svelte/store';
import type { Readable } from 'svelte/store';

export interface readableStoreConstructorOpts<T> {
	value: T;
}

export class _readableStore<T> extends _customStore<T> {
	declare $store: Readable<T>;
	$hasSubscriber: subscriberStore<T>;
	constructor({ value }: readableStoreConstructorOpts<T>) {
		super({ value, hasSubscriber: true });
		this.$hasSubscriber = new subscriberStore<T>({ value: false, _this: this });
		return this;
	}
	get value(): T {
		return get(this.$store);
	}
}

export default function readableStore<T>(value: T): _readableStore<T> {
	return new _readableStore<T>({ value });
}
