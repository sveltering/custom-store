import { writable, get } from 'svelte/store';
import type { Unsubscriber, Subscriber, Writable, Readable } from 'svelte/store';
import type subscriberStore from './readableStore/subscriberStore/subscriberStore.js';

export interface customStoreOpts<T> {
	value: T;
	isWritable?: boolean;
	hasSubscriber?: boolean;
}

export default class _customStore<T, R extends T> {
	$store: Readable<T> | Writable<T>;
	_destroys: (CallableFunction | null)[] = [];
	_setNull: () => void;
	_unsubscribes: (Unsubscriber | null)[] = [];
	declare $hasSubscriber: subscriberStore;
	constructor({ value, isWritable = true, hasSubscriber = false }: customStoreOpts<T>) {
		let _this = this;
		let $store = writable(value, function start() {
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
		this._setNull = () => {
			$store.set(null as any);
		};
		return this;
	}
	protected _unsubscribe(index: number): void {
		this._unsubscribes[index]?.();
		this._unsubscribes[index] = null;
	}
	subscribe(callback: Subscriber<T>): Unsubscriber {
		let unsubscribe = this.$store.subscribe(callback);
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
		this._unsubscribes = [];
		return this;
	}
	protected _runDestroys() {
		for (let i = 0, iLen = this._destroys.length; i < iLen; i++) {
			this._destroys[i]?.();
			this._destroys[i] = null;
		}
		this._destroys = [];
	}
	purge(): void {
		this.unsubscribeAll();
		this._runDestroys();
		this._setNull();
		let properties = Object.getOwnPropertyNames(this);
		for (let i = 0, iLen = properties.length; i < iLen; i++) {
			delete this[properties[i] as keyof _customStore<T, R>];
		}
	}
	get(): R {
		return get(this.$store) as unknown as R;
	}
}
