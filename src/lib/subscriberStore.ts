import type { Writable } from 'svelte/store';
import customStore from './customStore.js';

export default class subscriberStore extends customStore<boolean> {
	declare $store: Writable<boolean>;
	$hasSubscriber = false;
	constructor(value: boolean) {
		super(value);
		return this;
	}
}
