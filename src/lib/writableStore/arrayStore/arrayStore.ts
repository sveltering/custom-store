import { WritableStore } from '../writableStore.js';

type ArrayStoreOpts<T> = {
	value: T[];
};
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

	protected _insert_index(after: boolean = true, needleIndex: number, ...values: T[]): this {
		if (needleIndex < 0) {
			return this;
		}
		let sliceFrom = after ? needleIndex + 1 : needleIndex;

		let array1 = this.value.slice(0, sliceFrom);
		let array2 = this.value.slice(sliceFrom);
		this.value = [...array1, ...values, ...array2];
		return this;
	}

	protected _insert(after: boolean = true, first: boolean = true, needle: T, ...values: T[]): this {
		let needleIndex = first ? this.value.indexOf(needle) : this.value.lastIndexOf(needle);
		return this._insert_index(after, needleIndex, ...values);
	}

	addAfter(needleIndex: number, ...values: T[]): this {
		return this._insert_index(true, needleIndex, ...values);
	}
	addBefore(needleIndex: number, ...values: T[]): this {
		return this._insert_index(false, needleIndex, ...values);
	}
	addAfterFirst(needle: T, ...values: T[]): this {
		return this._insert(true, true, needle, ...values);
	}
	addBeforeFirst(needle: T, ...values: T[]): this {
		return this._insert(false, true, needle, ...values);
	}
	addAfterLast(needle: T, ...values: T[]): this {
		return this._insert(true, false, needle, ...values);
	}
	addBeforeLast(needle: T, ...values: T[]): this {
		return this._insert(false, false, needle, ...values);
	}
	protected _remove_first_last(first: boolean, value: T): this {
		let index = first ? this.value.indexOf(value) : this.value.lastIndexOf(value);
		if (index > -1) {
			this.value.splice(index, 1);
		}
		return this;
	}
	removeFirst(value: T): this {
		return this._remove_first_last(true, value);
	}
	removeLast(value: T): this {
		return this._remove_first_last(false, value);
	}
	removeEvery(value: T): this {
		this.value = this.value.filter((x: T) => x !== value);
		return this;
	}

	remove(index: number): this {
		this.value.splice(index, 1);
		return this;
	}

	pluck(index: number): T | void {
		let plucked = this.value.splice(index, 1);
		return plucked.length ? plucked[0] : undefined;
	}
}
function arrayStore<T>(value: T[] = []): ArrayStore<T> {
	return new ArrayStore({ value });
}

export default arrayStore;
export { ArrayStore };
export type { ArrayStoreOpts };
