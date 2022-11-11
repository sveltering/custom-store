import type { Writable } from 'svelte/store';
import customStore from './customStore.js';

export interface subscriberStoreConstructorOpts {
	value: boolean;
}
export default class subscriberStore extends customStore<boolean> {
	declare $store: Writable<boolean>;
	constructor({ value }: subscriberStoreConstructorOpts) {
		super({ value, hasSubscriber: false });
		return this;
	}
}
