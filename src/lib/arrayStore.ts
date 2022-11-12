import { _writableStore } from './writableStore.js';
import { get } from 'svelte/store';
export interface arrayStoreConstructorOpts<T> {
	value: T[];
}
class _arrayStore<T> extends _writableStore<T[]> {
	constructor({ value }: arrayStoreConstructorOpts<T>) {
		super({ value });
		this._initProxy(value);
		return this;
	}

	protected _initProxy(value: T[]): void {
		let _this = this;
		let revocable = Proxy.revocable<T[]>(value, {
			set: function (target: T[], property: string | symbol, value: T) {
				target[property as any] = value;
				if (property === 'length') {
					_this.set(target);
				}
				return true;
			}
		});
		this._proxy = revocable.proxy;
		this._revoke = revocable.revoke;
		this._destroys.push(revocable.revoke);
	}
	get value(): T[] {
		return this._proxy;
	}
	set value(value: T[]) {
		this?._revoke?.();
		this.set(value);
		this._initProxy(value);
	}
}

export default function arrayStore<T>(value: T[] = []): _arrayStore<T> {
	return new _arrayStore<T>({ value });
}
