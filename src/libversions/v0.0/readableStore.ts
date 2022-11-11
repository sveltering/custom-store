import customStore from './customStore.js';
import subscriberStore from './subscriberStore.js';
import { get } from 'svelte/store';
import type { Readable } from 'svelte/store';

export default class readableStore<T> extends customStore<T> {
	declare $store: Readable<T>;
	$hasSubscriber: subscriberStore = new subscriberStore(false);
	constructor(value: T) {
		super(value);
		return this;
	}
	get value(): T {
		return get(this.$store);
	}
	get(): T {
		return get(this.$store);
	}
}
