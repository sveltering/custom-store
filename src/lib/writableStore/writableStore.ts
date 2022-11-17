import _customStore from '../customStore.js';
import subscriberStore from '../readableStore/subscriberStore/subscriberStore.js';
import type { Writable, Updater } from 'svelte/store';

export interface writableStoreOpts<T> {
	value: T;
}
export class _writableStore<T> extends _customStore<T> {
	declare $store: Writable<T>;
	$hasSubscriber: subscriberStore;
	declare _proxy: { value: T };
	constructor({ value }: writableStoreOpts<T>) {
		super({ value, hasSubscriber: true });
		this.value = value;
		let _this = this;
		this.$hasSubscriber = new subscriberStore({ value: false, _this });
		this._destroys.push(() => (_this._proxy = null as any));
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
	update(callable: Updater<T>) {
		this.value = callable(this.value);
		return this;
	}
}
export default function writableStore<T>(value: T): _writableStore<T> {
	return new _writableStore({ value });
}
