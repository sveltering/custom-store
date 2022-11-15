import _customStore from '../customStore.js';
import subscriberStore from '../readableStore/subscriberStore/subscriberStore.js';

import type { Writable, Updater } from 'svelte/store';

export interface writableStoreConstructorOpts<T> {
	value: T;
}

export class _writableStore<T> extends _customStore<T> {
	declare $store: Writable<T>;
	declare _proxy: { value: T };
	$hasSubscriber: subscriberStore<T>;
	constructor({ value }: writableStoreConstructorOpts<T>) {
		super({ value });
		this.value = value;
		let _this = this;
		this.$hasSubscriber = new subscriberStore<T>({ value: false, _this });
		this._destroys.push(() => ((<any>_this._proxy) = null));
		return this;
	}

	protected _initProxy(value: T): void {
		this._proxy = { value };
		this.$store.set(this._proxy.value);
	}
	set value(value: T) {
		this._initProxy(value);
	}
	get value(): T {
		return this._proxy.value;
	}
	set(value: T): this {
		this._initProxy(value);
		return this;
	}
	update(callable: Updater<T>): this {
		this.value = callable(this.value);
		return this;
	}
}

export default function writableStore<T>(value: T): _writableStore<T> {
	return new _writableStore<T>({ value });
}
