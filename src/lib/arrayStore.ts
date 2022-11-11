import { _writableStore } from './writableStore.js';

import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

class _arrayStore<T> extends _writableStore<T[]> {
	constructor(value: T[]) {
		super(value);
		this._initProxy(value);
		return this;
	}

	protected _initProxy(value: T[]): void {
		let _this = this;
		let revocable = Proxy.revocable<T[]>(value, {
			set: function (target: T[], property: string | symbol, value: T) {
				target[property as any] = value;
				if (property === 'length') {
					console.log(value);
					console.log(target);
					_this.$store.set(target);
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
		this.$store.set(value);
		this?._revoke?.();
		this._initProxy(value);
	}
}

export default function arrayStore<T>(value: T[]): _arrayStore<T> {
	return new _arrayStore<T>(value);
}
