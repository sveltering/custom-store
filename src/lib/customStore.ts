import type subscriberStore from './subscriberStore.js';
import { writable, get } from 'svelte/store';
import type { Writable, Readable, Subscriber, Unsubscriber } from 'svelte/store';

export interface customStoreConstructorOpts<T> {
	value: T;
	isWritable?: boolean;
	hasSubscriber?: boolean;
}

export default class _customStore<T> {
	$store: Writable<T> | Readable<T>;
	declare $hasSubscriber: subscriberStore;
	_destroys: CallableFunction[] = [];
	protected _unsubscribes: (Unsubscriber | null)[] = [];

	constructor({ value, isWritable = true, hasSubscriber = false }: customStoreConstructorOpts<T>) {
		let _this = this;
		let $store = writable<T>(value, function start() {
			if (hasSubscriber) {
				_this.$hasSubscriber.$store.set(true);
			}
			return function stop() {
				_this._unsubscribes = [];
				if (hasSubscriber) {
					_this.$hasSubscriber.$store.set(false);
				}
			};
		});

		if (isWritable) {
			this.$store = $store;
		} //
		else {
			this.$store = { subscribe: $store.subscribe };
		}

		return this;
	}

	protected _unsubscribe(index: number): void {
		if (typeof this._unsubscribes?.[index] === 'function') {
			(<Unsubscriber>this._unsubscribes[index])();
			this._unsubscribes[index] = null;
		}
	}

	subscribe(callback: Subscriber<T>): Unsubscriber {
		let unsubscribe: Unsubscriber = this.$store.subscribe(callback);
		let unsubscribeIndex = this._unsubscribes.length;
		this._unsubscribes.push(unsubscribe);
		let _this = this;
		return () => {
			_this._unsubscribe(unsubscribeIndex);
		};
	}
	unsubscribeAll(): this {
		for (let i = 0, iLen = this._unsubscribes.length; i < iLen; i++) {
			this._unsubscribe(i);
		}
		return this;
	}
	protected _runDestroys(): void {
		for (let i = 0, iLen = this._destroys.length; i < iLen; i++) {
			if (typeof this._destroys[i] !== 'function') {
				continue;
			}
			this._destroys[i]();
		}
	}
	purge(): void {
		this.unsubscribeAll();
		this._runDestroys();
		let properties = Object.getOwnPropertyNames(this);
		for (let i = 0, iLen = properties.length; i < iLen; i++) {
			delete this[properties[i] as keyof this];
		}
	}

	get(): T {
		return get(this.$store);
	}
}
