import CustomStore from '../CustomStore.js';
import SubscriberStore from '../readableStore/SubscriberStore/SubscriberStore.js';
import type { Writable, Updater } from 'svelte/store';

type WritableStoreOpts<T> = {
	value: T;
};
class WritableStore<T, R extends T = T> extends CustomStore<T, R> {
	declare $store: Writable<T>;
	$hasSubscriber: SubscriberStore;
	declare _proxy: { value: R };
	constructor({ value }: WritableStoreOpts<T>) {
		super({ value, hasSubscriber: true });
		this.value = value;
		let _this = this;
		this.$hasSubscriber = new SubscriberStore({ value: false, _this });
		this._destroys.push(() => (_this._proxy = null as any));
		return this;
	}
	protected _initProxy(value: T): void {
		this._proxy = { value: value as unknown as R };
		this.$store.set(this._proxy.value as unknown as T);
	}
	set value(value: T) {
		this._initProxy(value);
	}
	get value(): R {
		return this._proxy.value;
	}
	set(value: T): this {
		this._initProxy(value);
		return this;
	}
	update(callable: Updater<T>): this {
		this._initProxy(callable(this._proxy.value as unknown as T));
		return this;
	}
}
function writableStore<T>(value: T): WritableStore<T, T> {
	return new WritableStore({ value });
}

export default writableStore;
export { WritableStore };
export type { WritableStoreOpts };
