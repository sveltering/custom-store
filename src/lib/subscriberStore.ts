import type { Writable } from 'svelte/store';
import customStore from './customStore';

export default class subscriberStore extends customStore<boolean> {
	declare $store: Writable<boolean>;
	constructor(value: boolean) {
		super(value);
		return this;
	}
}