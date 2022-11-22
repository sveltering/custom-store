import { _writableStore } from '../writableStore.js';

export interface arrayStoreOpts<T> {
	value: T[];
}
class _arrayStore<T> extends _writableStore<T[], T[]> {
	constructor({ value }: arrayStoreOpts<T>) {
		super({ value });
		return this;
	}
	protected _initProxy(value: T[]): void {
		let _this = this;
		this._proxy = {} as any;
		this._proxy.value = new Proxy(value, {
			set: function (target, property, value) {
				target[property as unknown as number] = value;
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
	return new _arrayStore({ value });
}
