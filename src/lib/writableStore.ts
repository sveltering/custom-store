import customStore from './customStore.js';
import subscriberStore from './subscriberStore.js';

import type { Writable, Updater } from 'svelte/store';

export class _writableStore<T> extends customStore<T> {
	declare $store: Writable<T>;
	$hasSubscriber: subscriberStore;
	protected _revoke!: CallableFunction;
	protected _proxy!: T;
	constructor(value: T) {
		super(value);
		this.$hasSubscriber = new subscriberStore(false);
		this._destroys.push(() => this.$hasSubscriber.purge());
		return this;
	}
	set value(value: T) {
		this._proxy = value;
		this.$store.set(value);
	}
	get value(): T {
		return this._proxy;
	}
	set(value: T): this {
		this._proxy = value;
		this.$store.set(value);
		return this;
	}
	get(): T {
		return this._proxy;
	}
	update(callable: Updater<T>): this {
		this.$store.update(callable);
		return this;
	}
}

export default function writableStore<T>(value: T): _writableStore<T> {
	return new _writableStore(value);
}
