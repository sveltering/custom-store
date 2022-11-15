import { _writableStore } from '../writableStore.js';

export interface proxyObjType<T> {
	[key: string | number | symbol]: proxyValueType<T>;
}

export type proxyValueType<T> = T | proxyObjType<T>;

interface keyValueStoreConstructorOpts<T> {
	value: proxyValueType<T>;
}

export class _proxyStore<T> extends _writableStore<proxyValueType<T>> {
	constructor({ value }: keyValueStoreConstructorOpts<T>) {
		super({ value });
		return this;
	}

	protected _initProxy(value: proxyValueType<T>): void {
		this._proxy = { value };
		//@ts-ignore
		this._proxy = proxify({
			target: this._proxy,
			_this: this
		});
		this.$store.set((<proxyObjType<T>>this._proxy).value);
	}
}

let isProxyableType = function (a: unknown): boolean {
	return !!a && (a.constructor === Object || a.constructor === Array);
};

interface proxifyOpts<T> {
	target: proxyValueType<T>;
	_this: _proxyStore<T>;
}

function proxify<T>({ target, _this }: proxifyOpts<T>) {
	return new Proxy(<proxyObjType<T>>target, {
		get: function (target, property) {
			if (property === '_$$isProxyStore') {
				return true;
			}

			if (
				//@ts-ignore
				!target[property]?._$$isProxyStore &&
				target.hasOwnProperty(property) &&
				isProxyableType(target[property])
			) {
				target[property] = proxify({
					target: target[property],
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
			if (!(property in target)) {
				return false;
			}
			delete target[property];
			_this.$store.set(_this._proxy.value);
			return true;
		}
	});
}

export default function proxyStore<T>(value: proxyValueType<T>) {
	return new _proxyStore<T>({ value });
}
