import { _writableStore } from '../writableStore.js';
export interface arrayStoreConstructorOpts<T> {
	value: T[];
}
class _arrayStore<T> extends _writableStore<T[]> {
	constructor({ value }: arrayStoreConstructorOpts<T>) {
		super({ value });
		return this;
	}

	protected _initProxy(value: T[]): void {
		let _this = this;
		//@ts-ignore
		this._proxy = {};
		this._proxy.value = new Proxy<T[]>(value, {
			set: function (target: T[], property: string | symbol, value: T) {
				target[property as any] = value;
				if (property === 'length') {
					_this.$store.set(target);
				}
				return true;
			}
		});
		this.$store.set(this._proxy.value);
	}
}

export default function arrayStore<T>(value: T[] = []): _arrayStore<T> {
	return new _arrayStore<T>({ value });
}
