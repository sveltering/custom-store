import customStore from './customStore.js';
import subscriberStore from './subscriberStore.js';
import { get } from 'svelte/store';

import type { Writable, Updater } from 'svelte/store';

export default class writableStore<T> extends customStore<T> {
	declare $store: Writable<T>;
	$hasSubscriber: subscriberStore = new subscriberStore(false);
	constructor(value: T) {
		super(value);
		return this;
	}
	set value(value: T) {
		console.log('setting');
		this.$store.set(value);
	}
	get value(): T {
		console.log('getting');
		return get(this.$store);
	}
	set(value: T): this {
		this.$store.set(value);
		return this;
	}
	get(): T {
		return get(this.$store);
	}
	update(callable: Updater<T>): this {
		this.$store.update(callable);
		return this;
	}
}
