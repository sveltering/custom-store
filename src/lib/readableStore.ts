import customStore from './customStore.js';
import subscriberStore from './subscriberStore.js';
import { get } from 'svelte/store';
import type { Readable } from 'svelte/store';

export class _readableStore<T> extends customStore<T> {
	declare $store: Readable<T>;
	$hasSubscriber: subscriberStore;
	constructor(value: T) {
		super(value);
		this.$hasSubscriber = new subscriberStore(false);
		this._destroys.push(() => this.$hasSubscriber.purge());
		return this;
	}
	get value(): T {
		return get(this.$store);
	}
	get(): T {
		return get(this.$store);
	}
}

export default function readableStore<T>(value: T): _readableStore<T> {
	return new _readableStore(value);
}
