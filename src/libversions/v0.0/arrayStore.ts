import writableStore from './writableStore.js';
export default class arrayStore<A> extends writableStore<A[]> {
	constructor(value: A[] = []) {
		super(value);
		return this;
	}

	unshift(...args: A[]): this {
		let array = this.value;
		array.unshift(...args);
		this.value = array;
		return this;
	}
	push(...args: A[]): this {
		let array = this.value;
		array.push(...args);
		this.value = array;
		return this;
	}

	protected _insert_index(after: boolean = true, needleIndex: number, ...values: A[]): this {
		if (needleIndex < 0) {
			return this;
		}
		let array = this.value;
		let sliceFrom = after ? needleIndex + 1 : needleIndex;

		let array1 = array.slice(0, sliceFrom);
		let array2 = array.slice(sliceFrom);

		this.value = [...array1, ...values, ...array2];
		return this;
	}

	protected _insert(after: boolean = true, first: boolean = true, needle: A, ...values: A[]): this {
		let needleIndex = first ? this.value.indexOf(needle) : this.value.lastIndexOf(needle);
		return this._insert_index(after, needleIndex, ...values);
	}

	addAfter(needle: A, ...values: A[]): this {
		return this._insert(true, true, needle, ...values);
	}
	addBefore(needle: A, ...values: A[]): this {
		return this._insert(false, true, needle, ...values);
	}
	addAfterLast(needle: A, ...values: A[]): this {
		return this._insert(true, false, needle, ...values);
	}
	addBeforeLast(needle: A, ...values: A[]): this {
		return this._insert(false, false, needle, ...values);
	}

	addAfterIndex(needleIndex: number, ...values: A[]): this {
		return this._insert_index(true, needleIndex, ...values);
	}
	addBeforeIndex(needleIndex: number, ...values: A[]): this {
		return this._insert_index(false, needleIndex, ...values);
	}
	protected _removeFirstOrLast(value: A, first: boolean = true) {
		let array = this.value;
		let valueIndex = first ? this.value.indexOf(value) : this.value.lastIndexOf(value);
		if (valueIndex > -1) {
			array.splice(valueIndex, 1);
			this.value = array;
		}
		return this;
	}
	removeFirst(value: A): this {
		return this._removeFirstOrLast(value, true);
	}
	removeLast(value: A): this {
		return this._removeFirstOrLast(value, false);
	}
	removeEvery(value: A): this {
		let array = this.value;
		array = array.filter((x: A) => x !== value);
		this.value = array;
		return this;
	}

	includes(value: A): boolean {
		return this.value.includes(value);
	}
	getAll() {
		return this.value;
	}
	replaceAll(array: A[]): this {
		this.value = array;
		return this;
	}

	delete(index: number): this {
		let array = this.value;
		array.splice(index, 1);
		this.value = array;
		return this;
	}
	deleteAll(): this {
		this.value = [];
		return this;
	}

	pluck(index: number): A | void {
		let array = this.value;
		let plucked = array.splice(index, 1);
		this.value = array;
		return plucked.length ? plucked[0] : undefined;
	}
	get length(): number {
		return this.value.length;
	}
}
