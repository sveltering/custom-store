import type { subscriberStore } from './subscriberStore';
import { writable } from 'svelte/store';
import type { Writable, Readable, Subscriber, Unsubscriber } from 'svelte/store';

export class customStore<T> {
	$hasSubscriber: subscriberStore | false = false;
	$store: Writable<T> | Readable<T>;
	protected _unsubscribes: (Unsubscriber | null)[] = [];

	constructor(value: T, isWritable: boolean = true) {
		let _this = this;
		let $store = writable<T>(value, function start() {
			if (_this.$hasSubscriber) {
				_this.$hasSubscriber.$store.set(true);
			}
			return function stop() {
				_this._unsubscribes = [];
				if (_this.$hasSubscriber) {
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
	purge(): void {
		this.unsubscribeAll();
		(<subscriberStore>this?.$hasSubscriber)?.purge?.();

		let properties = Object.getOwnPropertyNames(this);
		for (let i = 0, iLen = properties.length; i < iLen; i++) {
			delete this[properties[i] as keyof this];
		}
	}
}
