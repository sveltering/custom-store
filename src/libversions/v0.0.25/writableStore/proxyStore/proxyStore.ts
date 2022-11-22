import { WritableStore } from '../writableStore.js';

type ProxyValueType<T> = T | Array<T> | KeyValueType<T> | KeyValueType<ProxyValueType<T>>;

interface KeyValueType<T> {
	[key: string | number | symbol]: ProxyValueType<T>;
}

interface ProxyStoreOpts<T> {
	value: ProxyValueType<T>;
}
class ProxyStore<T> extends WritableStore<ProxyValueType<T>, any> {
	constructor({ value }: ProxyStoreOpts<T>) {
		super({ value });
		return this;
	}
	_initProxy(value: ProxyValueType<T>) {
		this._proxy = { value };
		this._proxy = proxify({
			target: this._proxy,
			_this: this
		}) as { value: ProxyValueType<T> };
		this.$store.set(this._proxy.value);
	}
}
let isProxyableType = function (obj: unknown): boolean {
	return !!obj && (obj.constructor === Object || obj.constructor === Array);
};

interface ProxifyOpts<T> {
	target: KeyValueType<T>;
	_this: ProxyStore<T>;
}
function proxify<T>({ target, _this }: ProxifyOpts<T>) {
	return new Proxy(target, {
		get: function (target, property) {
			if (property === '_$$isProxyStore') {
				return true;
			}
			if (
				!(target[property] as KeyValueType<T>)?._$$isProxyStore &&
				target.hasOwnProperty(property) &&
				isProxyableType(target[property])
			) {
				target[property] = proxify({
					target: target[property] as KeyValueType<T>,
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
function proxyStore<T>(value: ProxyValueType<T>): ProxyStore<T> {
	return new ProxyStore({ value });
}

export default proxyStore;
export { ProxyStore };
export type { ProxyStoreOpts, ProxyValueType, KeyValueType };
