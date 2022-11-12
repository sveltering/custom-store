import { _writableStore } from './writableStore.js';

export interface proxyType<T> {
	[key: string | number]: T | proxyType<T>;
}

export interface keyValueStoreConstructorOpts<T> {
	value: proxyType<T> | T;
}
class _proxyStore<T> extends _writableStore<any> {
	_revokes: Map<proxyType<T>, CallableFunction> = new Map();
	constructor({ value }: keyValueStoreConstructorOpts<T>) {
		super({ value });
		this.value = value;
		return this;
	}

	protected _initProxy(value: proxyType<T>): void {
		this._revokes.forEach((revoke) => {
			revoke();
		});
		this._revokes = new Map();
		this._proxy = { value };
		this._proxy = proxify({
			target: this._proxy,
			_this: this
		});

		this.set(this._proxy.value);
	}
	get value(): proxyType<T> | T {
		return this._proxy.value;
	}
	set value(value: proxyType<T> | T) {
		this._initProxy(value);
	}
}

let isArrayType = function (a: unknown): boolean {
	return !!a && a.constructor === Array;
};
let isObjectType = function (a: unknown): boolean {
	return !!a && a.constructor === Object;
};
let isProxyType = function (a: unknown): boolean {
	return !!a && (a.constructor === Object || a.constructor === Array);
};

function _revokeNested(_this, target) {
	if (_this._revokes.has(target)) {
		for (let property in target) {
			_revokeNested(_this, target[property]);
		}
		_this._revokes.get(target)();
		_this._revokes.delete(target);
	}
}

//@ts-ignore
function proxify({ target, _this }) {
	if (_this._revokes.has(target) || !isProxyType(target)) {
		return target;
	}

	let revocable = Proxy.revocable(target, {
		set: function (target, property, value) {
			if (property in target) {
				_revokeNested(_this, target[property]);
			}
			target[property as any] = proxify({
				target: value,
				_this
			});

			if (isArrayType(target)) {
				if (property === 'length') {
					_this.set(_this._proxy.value);
					return true;
				}
				return true;
			}

			_this.set(_this._proxy.value);
			return true;
		},
		deleteProperty(target, property) {
			if (property in target) {
				_revokeNested(_this, target[property]);
				delete target[property];
			}
			if (isArrayType(target)) {
				if (property === 'length') {
					_this.set(_this._proxy.value);
					return true;
				}
				return true;
			}

			_this.set(_this._proxy.value);
			return true;
		}
	});

	for (let property in target) {
		target[property as any] = proxify({
			target: target[property],
			_this
		});
	}
	_this._revokes.set(revocable.proxy, revocable.revoke);
	return revocable.proxy;
}

export default function proxyStore<T>(value: proxyType<T>) {
	return new _proxyStore<T>({ value });
}
