import { writable, get } from 'svelte/store';
import type { Writable, Subscriber, Unsubscriber } from 'svelte/store';

export type subscriptionWatcher = (hasSubscriber?: boolean) => any;

export default abstract class CustomStore<T> {
	protected _store: Writable<T>;
	protected _unsubscribes: (Unsubscriber | null)[] = [];
	protected _subscriptionWatches: subscriptionWatcher[] = [];

	constructor(value: T) {
		let _this = this;
		this._store = writable<T>(value, function start() {
			_this._subscriptionChanged(true);
			return function stop() {
				_this._unsubscribes = [];
				_this._subscriptionChanged(false);
			};
		});
		return this;
	}

	get store(): Writable<T> {
		return this._store;
	}

	get value(): T {
		return get(this._store);
	}

	set value(value: T) {
		this._store.set(value);
	}

	protected _subscriptionChanged(hasSubscriber: boolean): void {
		for (let i = 0, iLen = this._subscriptionWatches.length; i < iLen; i++) {
			this._subscriptionWatches[i](hasSubscriber);
		}
	}

	protected _unsubscribe(index: number): void {
		if (typeof this._unsubscribes?.[index] === 'function') {
			(<Unsubscriber>this._unsubscribes[index])();
			this._unsubscribes[index] = null;
		}
	}

	subscribe(callback: Subscriber<T>): Unsubscriber {
		let _this = this;
		let unsubscribe: Unsubscriber = this._store.subscribe(callback);
		let unsubscribeIndex = this._unsubscribes.length;
		this._unsubscribes.push(unsubscribe);
		return () => {
			_this._unsubscribe(unsubscribeIndex);
		};
	}

	destroy(): void {
		for (let i = 0, iLen = this._unsubscribes.length; i < iLen; i++) {
			this._unsubscribe(i);
		}
		let properties = Object.getOwnPropertyNames(this);

		for (let i = 0, iLen = properties.length; i < iLen; i++) {
			delete this[properties[i] as keyof this];
		}
	}
	subscriptionChange(callback: subscriptionWatcher): this {
		this._subscriptionWatches.push(callback);
		return this;
	}
}
