import { writableStore } from './writableStore';
export type KeyValue<C> = { [key: string]: C };

export class keyValueStore<C> extends writableStore<KeyValue<C>> {
	constructor(value: KeyValue<C> = {}) {
		super(value);
		return this;
	}
	getKey(key: string): C {
		return this.value?.[key];
	}
	getAll(): KeyValue<C> {
		return this.value;
	}
	setKey(key: string, value: C): this {
		this.value = {
			...this.value,
			[key]: value
		};
		return this;
	}
	updateKeys(keyValue: KeyValue<C>): this {
		this.value = {
			...this.value,
			...keyValue
		};
		return this;
	}
	replaceAll(keyValue: KeyValue<C>): this {
		this.value = keyValue;
		return this;
	}
	deleteKey(key: string): this {
		let keyValue: KeyValue<C> = this.value;
		delete keyValue[key];
		this.value = keyValue;
		return this;
	}
	deleteKeys(...keys: string[]): this {
		let keyValue: KeyValue<C> = this.value;
		for (let i = 0, iLen = keys.length; i < iLen; i++) {
			delete keyValue[keys[i]];
		}
		this.value = keyValue;
		return this;
	}
	deleteAll(): this {
		this.value = {};
		return this;
	}
	keys(): string[] {
		return Object.keys(this.value);
	}
	hasKey(key: string): boolean {
		return this.value.hasOwnProperty(key);
	}
	pluck(key: string): C {
		let keyValue: KeyValue<C> = this.value;
		let plucked = keyValue[key];
		delete keyValue[key];
		this.value = keyValue;
		return plucked;
	}
}
