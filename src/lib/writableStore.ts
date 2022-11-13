import _customStore from './customStore.js';
import subscriberStore from './subscriberStore.js';

import type { Writable, Updater } from 'svelte/store';

export interface writableStoreConstructorOpts<T> {
	value: T;
}

export class _writableStore<T> extends _customStore<T> {
	declare $store: Writable<T>;
	declare _proxy: T;
	$hasSubscriber: subscriberStore<T>;
	constructor({ value }: writableStoreConstructorOpts<T>) {
		super({ value });
		this.value = value;
		this.$hasSubscriber = new subscriberStore<T>({ value: false, _this: this });
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
		this.$store.set(value);
		return this;
	}
	update(callable: Updater<T>): this {
		this.$store.update(callable);
		return this;
	}
}

export default function writableStore<T>(value: T): _writableStore<T> {
	return new _writableStore<T>({ value });
}
