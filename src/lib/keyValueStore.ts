import { _writableStore } from './writableStore.js';

export interface keyValue<T> {
	[key: string]: T;
}
export interface keyValueStoreConstructorOpts<T> {
	value: keyValue<T>;
}
class _keyValueStore<T> extends _writableStore<keyValue<T>> {
	declare _revoke: CallableFunction;
	constructor({ value }: keyValueStoreConstructorOpts<T>) {
		super({ value });
		this._initProxy(value);
		return this;
	}

	protected _initProxy(value: keyValue<T>): void {
		let _this = this;
		let revocable = Proxy.revocable<keyValue<T>>(value, {
			set: function (target: keyValue<T>, property: string | symbol, value: T) {
				target[property as any] = value;
				_this.set(target);
				return true;
			}
		});
		this._proxy = revocable.proxy;
		this._revoke = revocable.revoke;
		this._destroys.push(revocable.revoke);
	}
	get value(): keyValue<T> {
		return this._proxy;
	}
	set value(value: keyValue<T>) {
		this?._revoke?.();
		this.set(value);
		this._initProxy(value);
	}
}

export default function keyValueStore<T>(value: keyValue<T> = {}): _keyValueStore<T> {
	return new _keyValueStore<T>({ value });
}
