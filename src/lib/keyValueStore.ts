import { _writableStore } from './writableStore.js';

export interface keyValue<T> {
	[key: string]: T;
}
export interface keyValueStoreConstructorOpts<T> {
	value: keyValue<T>;
}
class _keyValueStore<T> extends _writableStore<keyValue<T>> {
	declare _proxy: keyValue<T>;
	constructor({ value }: keyValueStoreConstructorOpts<T>) {
		super({ value });
		this.value = value;
		let _this = this;
		this._destroys.push(() => ((<any>_this._proxy) = null));
		return this;
	}

	protected _initProxy(value: keyValue<T>): void {
		let _this = this;
		this._proxy = new Proxy<keyValue<T>>(value, {
			set: function (target: keyValue<T>, property: string | symbol, value: T) {
				target[property as any] = value;
				_this.set(target);
				return true;
			}
		});
		this.set(this._proxy);
	}
	get value(): keyValue<T> {
		return this._proxy;
	}
	set value(value: keyValue<T>) {
		this._initProxy(value);
	}
}

export default function keyValueStore<T>(value: keyValue<T> = {}): _keyValueStore<T> {
	return new _keyValueStore<T>({ value });
}
