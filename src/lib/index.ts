import { writable, get } from 'svelte/store';
import type { Writable, Readable, Subscriber, Unsubscriber } from 'svelte/store';

export class CustomStore<T> {
	$hasSubscriber: SubscriberStore | false = false;
	$store: Writable<T> | Readable<T>;
	protected _unsubscribes: (Unsubscriber | null)[] = [];

	constructor(value: T, isWritable: boolean = true) {
		let _this = this;
		let $store = writable<T>(value, function start() {
			if (_this.$hasSubscriber) {
				_this.$hasSubscriber.value = true;
			}
			return function stop() {
				_this._unsubscribes = [];
				if (_this.$hasSubscriber) {
					_this.$hasSubscriber.value = false;
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

	get value(): T {
		return get(this.$store);
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

	purge(): void {
		for (let i = 0, iLen = this._unsubscribes.length; i < iLen; i++) {
			this._unsubscribe(i);
		}
		if (this.$hasSubscriber) {
			this.$hasSubscriber.purge();
		}
		let properties = Object.getOwnPropertyNames(this);

		for (let i = 0, iLen = properties.length; i < iLen; i++) {
			delete this[properties[i] as keyof this];
		}
	}
}

class SubscriberStore extends CustomStore<boolean> {
	declare $store: Writable<boolean>;
	constructor(value: boolean) {
		super(value);
		return this;
	}
	set value(value: boolean) {
		this.$store.set(value);
	}
}

export class WritableStore<T> extends CustomStore<T> {
	declare $store: Writable<T>;
	$hasSubscriber: SubscriberStore = new SubscriberStore(false);
	constructor(value: T) {
		super(value);
		return this;
	}
	set value(value: T) {
		this.$store.set(value);
	}
}
export class ReadableStore<T> extends CustomStore<T> {
	declare $store: Readable<T>;
	$hasSubscriber: SubscriberStore = new SubscriberStore(false);
	constructor(value: T) {
		super(value);
		return this;
	}
}
