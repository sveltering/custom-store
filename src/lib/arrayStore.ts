import { _writableStore } from './writableStore.js';
export interface arrayStoreConstructorOpts<T> {
	value: T[];
}
class _arrayStore<T> extends _writableStore<T[]> {
	declare _proxy: T[];
	constructor({ value }: arrayStoreConstructorOpts<T>) {
		super({ value });
		this.value = value;
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
					_this.$store.set(target);
				}
				return true;
			}
		});
		this.$store.set(this._proxy);
	}
	get value(): T[] {
		return this._proxy;
	}
	set value(value: T[]) {
		this._initProxy(value);
	}
	set(value: T[]): this {
		this.value = value;
		return this;
	}
}

export default function arrayStore<T>(value: T[] = []): _arrayStore<T> {
	return new _arrayStore<T>({ value });
}
