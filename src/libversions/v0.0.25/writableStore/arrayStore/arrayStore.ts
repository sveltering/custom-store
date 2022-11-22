import { WritableStore } from '../writableStore.js';

interface ArrayStoreOpts<T> {
	value: T[];
}
class ArrayStore<T> extends WritableStore<T[]> {
	constructor({ value }: ArrayStoreOpts<T>) {
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
function arrayStore<T>(value: T[] = []): ArrayStore<T> {
	return new ArrayStore({ value });
}

export default arrayStore;
export { ArrayStore };
export type { ArrayStoreOpts };
