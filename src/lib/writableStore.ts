import { customStore } from './customStore';
import { subscriberStore } from './subscriberStore';
import { get } from 'svelte/store';

import type { Writable, Updater } from 'svelte/store';

export class writableStore<T> extends customStore<T> {
	declare $store: Writable<T>;
	$hasSubscriber: subscriberStore = new subscriberStore(false);
	constructor(value: T) {
		super(value);
		return this;
	}
	set value(value: T) {
		this.$store.set(value);
	}
	get value(): T {
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
