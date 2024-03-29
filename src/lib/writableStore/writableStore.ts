import CustomStore from '../CustomStore.js';
import SubscriberStore from '../readableStore/SubscriberStore/SubscriberStore.js';
import type { Writable, Updater } from 'svelte/store';

type WritableStoreOpts<T> = {
	value: T;
};
class WritableStore<T> extends CustomStore<T> {
	declare $store: Writable<T>;
	$hasSubscriber: SubscriberStore;
	declare _proxy: { value: T };
	constructor({ value }: WritableStoreOpts<T>) {
		super({ value, hasSubscriber: true });
		this.value = value;
		let _this = this;
		this.$hasSubscriber = new SubscriberStore({ value: false, _this });
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
	update(callable: Updater<T>): this {
		this._initProxy(callable(this._proxy.value));
		return this;
	}
}
function writableStore<T>(value: T): WritableStore<T> {
	return new WritableStore<T>({ value });
}

export default writableStore;
export { WritableStore };
export type { WritableStoreOpts };
