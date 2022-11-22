import { WritableStore } from '../writableStore.js';

export interface KeyValueType<T> {
	[key: string | number | symbol]: T;
}
export interface keyValueStoreOpts<T> {
	value: KeyValueType<T>;
}
class KeyValueStore<T> extends WritableStore<KeyValueType<T>, KeyValueType<T>> {
	constructor({ value }: keyValueStoreOpts<T>) {
		super({ value });
		return this;
	}
	_initProxy(value: KeyValueType<T>) {
		let _this = this;
		this._proxy = {} as any;
		this._proxy.value = new Proxy(value, {
			set: function (target, property, value) {
				target[property as unknown as number | string] = value;
				_this.$store.set(target);
				return true;
			}
		});
		this.$store.set(this._proxy.value);
	}
}
function keyValueStore<T>(value: KeyValueType<T> = {}): KeyValueStore<T> {
	return new KeyValueStore({ value });
}
export default keyValueStore;
export { KeyValueStore };
