import { _writableStore } from '../writableStore.js';

export interface keyValueType<T> {
	[key: string | number | symbol]: T | keyValueType<T>;
}
export interface keyValueStoreOpts<T> {
	value: keyValueType<T>;
}
class _keyValueStore<T> extends _writableStore<keyValueType<T>, keyValueType<T>> {
	constructor({ value }: keyValueStoreOpts<T>) {
		super({ value });
		return this;
	}
	_initProxy(value: keyValueType<T>) {
		let _this = this;
		this._proxy = {} as any;
		this._proxy.value = new Proxy(value, {
			set: function (target, property, value) {
				target[property as unknown as number | string] = value;
				_this.$store.set(target);
				return true;
			}
		});
		this.$store.set(this._proxy.value);
	}
}
export default function keyValueStore<T>(value: keyValueType<T> = {}): _keyValueStore<T> {
	return new _keyValueStore({ value });
}
