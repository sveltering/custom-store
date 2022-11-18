import { _writableStore } from '../writableStore.js';
import type { keyValueType } from '../keyValueStore/keyValueStore.js';

export type proxyValueType<T> = T | T[] | keyValueType<T>;

export interface proxyStoreOpts<T> {
	value: proxyValueType<T>;
}
export class _proxyStore<T> extends _writableStore<proxyValueType<T>, any> {
	constructor({ value }: proxyStoreOpts<T>) {
		super({ value });
		return this;
	}
	_initProxy(value: proxyValueType<T>) {
		this._proxy = { value };
		this._proxy = proxify({
			target: this._proxy,
			_this: this
		}) as { value: proxyValueType<T> };
		this.$store.set(this._proxy.value);
	}
}
let isProxyableType = function (obj: unknown): boolean {
	return !!obj && (obj.constructor === Object || obj.constructor === Array);
};

interface proxifyOpts<T> {
	target: keyValueType<T>;
	_this: _proxyStore<T>;
}
function proxify<T>({ target, _this }: proxifyOpts<T>) {
	return new Proxy(target, {
		get: function (target, property) {
			if (property === '_$$isProxyStore') {
				return true;
			}
			if (
				!(target[property] as keyValueType<T>)?._$$isProxyStore &&
				target.hasOwnProperty(property) &&
				isProxyableType(target[property])
			) {
				target[property] = proxify({
					target: target[property] as keyValueType<T>,
					_this
				});
			}
			return target?.[property];
		},
		set: function (target, property, value) {
			if (target[property] === value) {
				return true;
			}
			target[property] = value;
			_this.$store.set(_this._proxy.value);
			return true;
		},
		deleteProperty(target, property) {
			if (property in target) {
				delete target[property];
				_this.$store.set(_this._proxy.value);
			}
			return true;
		}
	});
}
export default function proxyStore<T>(value: proxyValueType<T>): _proxyStore<T> {
	return new _proxyStore({ value });
}
