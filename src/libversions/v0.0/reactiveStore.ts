import { writable } from 'svelte/store';

export default function reactiveStore<T extends object>(value: T) {
	let store = writable<T>(value);
	let proxy = new Proxy(value, {
		get: function (target: T, property: string | symbol) {
			if (property === 'subscribe') {
				return store.subscribe;
			}
			return target[property];
		},
		set: function (target, property, value, receiver) {
			target[property] = value;
			store.set(target);
			return true;
		}
	});
	return proxy;
}
