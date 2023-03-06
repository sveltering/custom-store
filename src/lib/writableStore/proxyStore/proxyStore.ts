import { WritableStore } from '../writableStore.js';

type ProxyStoreOpts<T> = {
	value: T;
};
class ProxyStore<T extends object> extends WritableStore<T> {
	constructor({ value }: ProxyStoreOpts<T>) {
		super({ value });
		return this;
	}
	_initProxy(value: T) {
		this._proxy = { value };
		this._proxy = proxify<T>({
			target: this._proxy as any,
			_this: this
		}) as { value: T };
		this.$store.set(this._proxy.value);
	}
}
let isProxyableType = function (obj: unknown): boolean {
	return !!obj && (obj.constructor === Object || obj.constructor === Array);
};

type ProxifyOpts<T extends object> = {
	target: T;
	_this: ProxyStore<T>;
};
function proxify<T extends object>({ target, _this }: ProxifyOpts<T>) {
	return new Proxy(target as object, {
		get: function (target, property) {
			if (property === '_$$isProxyStore') {
				return true;
			}
			if (
				//@ts-ignore
				!target?.[property as keyof typeof target]?._$$isProxyStore &&
				target.hasOwnProperty(property) &&
				isProxyableType(target[property as keyof typeof target])
			) {
				target[property as keyof typeof target] = proxify({
					target: target[property as keyof typeof target],
					_this
				}) as never;
			}
			return target?.[property as keyof typeof target];
		},
		set: function (target, property, value) {
			if (target?.[property as keyof typeof target] === value) {
				return true;
			}
			target[property as keyof typeof target] = value as never;
			_this.$store.set(_this._proxy.value);
			return true;
		},
		deleteProperty(target, property) {
			if (target === _this._proxy) {
				return true;
			}
			if (property in target) {
				delete target[property as keyof typeof target];
				_this.$store.set(_this._proxy.value);
			}
			return true;
		}
	});
}
function proxyStore<T extends object>(value: T = {} as any): ProxyStore<T> {
	return new ProxyStore<T>({ value });
}

export default proxyStore;
export { ProxyStore };
export type { ProxyStoreOpts };
