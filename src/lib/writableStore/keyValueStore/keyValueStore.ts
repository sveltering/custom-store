import { WritableStore } from '../writableStore.js';

type KeyValueType = Record<string | symbol | number, any>;

type KeyValueStoreOpts<T> = {
	value: T;
};
class KeyValueStore<T extends KeyValueType> extends WritableStore<T> {
	constructor({ value }: KeyValueStoreOpts<T>) {
		super({ value });
		return this;
	}
	_initProxy(value: T) {
		let _this = this;
		this._proxy = {} as any;
		this._proxy.value = new Proxy(value, {
			set: function (target, property, value) {
				target[property as keyof typeof target] = value;
				_this.$store.set(target);
				return true;
			},
			deleteProperty(target, property) {
				if (property in target) {
					delete target[property as keyof typeof target];
					_this.$store.set(target);
				}
				return true;
			}
		});
		this.$store.set(this._proxy.value);
	}
}
function keyValueStore<T extends KeyValueType>(value: T = {} as any): KeyValueStore<T> {
	return new KeyValueStore<T>({ value });
}

export default keyValueStore;
export { KeyValueStore };
export type { KeyValueStoreOpts };
