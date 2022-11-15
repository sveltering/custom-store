import { _writableStore } from '../writableStore.js';

export interface keyValue<T> {
	[key: string]: T;
}
export interface keyValueStoreConstructorOpts<T> {
	value: keyValue<T>;
}
class _keyValueStore<T> extends _writableStore<keyValue<T>> {
	constructor({ value }: keyValueStoreConstructorOpts<T>) {
		super({ value });
		return this;
	}

	protected _initProxy(value: keyValue<T>): void {
		let _this = this;
		//@ts-ignore
		this._proxy = {};
		this._proxy.value = new Proxy<keyValue<T>>(value, {
			set: function (target: keyValue<T>, property: string | symbol, value: T) {
				target[property as any] = value;
				_this.$store.set(target);
				return true;
			}
		});
		this.$store.set(this._proxy.value);
	}
}

export default function keyValueStore<T>(value: keyValue<T> = {}): _keyValueStore<T> {
	return new _keyValueStore<T>({ value });
}
