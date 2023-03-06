import CustomStore from '../CustomStore.js';
import SubscriberStore from './SubscriberStore/SubscriberStore.js';
import type { Readable } from 'svelte/store';

type ReadableStoreOpts<T> = {
	value: T;
};

class ReadableStore<T> extends CustomStore<T> {
	declare $store: Readable<T>;
	$hasSubscriber: SubscriberStore;
	constructor({ value }: ReadableStoreOpts<T>) {
		super({ value, hasSubscriber: true });
		this.$hasSubscriber = new SubscriberStore({ value: false, _this: this });
		return this;
	}
}
function readableStore<T>(value: T): ReadableStore<T> {
	return new ReadableStore<T>({ value });
}

export default readableStore;
export { ReadableStore };
export type { ReadableStoreOpts };
