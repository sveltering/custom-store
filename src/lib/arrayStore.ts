import { _writableStore } from './writableStore.js';
import { get } from 'svelte/store';
export interface arrayStoreConstructorOpts<T> {
	value: T[];
}
class _arrayStore<T> extends _writableStore<T[]> {
	declare _proxy: T[];
	constructor({ value }: arrayStoreConstructorOpts<T>) {
		super({ value });
		this._initProxy(value);
		let _this = this;
		this._destroys.push(() => ((<any>_this._proxy) = null));
		return this;
	}

	protected _initProxy(value: T[]): void {
		let _this = this;
		this._proxy = new Proxy<T[]>(value, {
			set: function (target: T[], property: string | symbol, value: T) {
				target[property as any] = value;
				if (property === 'length') {
					_this.set(target);
				}
				return true;
			}
		});
		this.set(this._proxy);
	}
	get value(): T[] {
		return this._proxy;
	}
	set value(value: T[]) {
		this._initProxy(value);
	}
}

export default function arrayStore<T>(value: T[] = []): _arrayStore<T> {
	return new _arrayStore<T>({ value });
}
