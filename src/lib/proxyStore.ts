import { _writableStore } from './writableStore.js';

export interface proxyObjType<T> {
	[key: string | number]: proxyValueType<T>;
}

export type proxyValueType<T> = T | proxyObjType<T>;

interface keyValueStoreConstructorOpts<T> {
	value: proxyValueType<T>;
}

type _proxyPropType<T> = { value: proxyValueType<T> };

class _proxyStore<T> extends _writableStore<proxyValueType<T>> {
	declare _proxy: _proxyPropType<T>;
	_revokes: Map<proxyObjType<T>, CallableFunction> = new Map();
	constructor({ value }: keyValueStoreConstructorOpts<T>) {
		super({ value });
		this.value = value;
		return this;
	}

	protected _initProxy(value: proxyValueType<T>): void {
		this._revokes.forEach((revoke) => {
			revoke();
		});
		this._revokes = new Map();
		this._proxy = { value };
		this._proxy = <_proxyPropType<T>>proxify({
			target: this._proxy,
			_this: this
		});

		this.set((<proxyObjType<T>>this._proxy).value);
	}
	get value(): proxyValueType<T> {
		return this._proxy.value;
	}
	set value(value: proxyValueType<T>) {
		this._initProxy(value);
	}
}

let isArrayType = function (a: unknown): boolean {
	return !!a && a.constructor === Array;
};
let isProxyType = function (a: unknown): boolean {
	return !!a && (a.constructor === Object || a.constructor === Array);
};

function _revokeNested<T>(_this: _proxyStore<T>, target: proxyObjType<T>) {
	if (_this._revokes.has(target)) {
		for (let property in target) {
			_revokeNested(_this, <proxyObjType<T>>target[property]);
		}
		(<CallableFunction>_this._revokes.get(target))();
		_this._revokes.delete(target);
	}
}

interface proxifyOpts<T> {
	target: proxyValueType<T>;
	_this: _proxyStore<T>;
}
function proxify<T>({ target, _this }: proxifyOpts<T>) {
	if (!isProxyType(target) || _this._revokes.has(<proxyObjType<T>>target)) {
		return target;
	}

	let revocable = Proxy.revocable(<proxyObjType<T>>target, {
		set: function (target, property, value) {
			if (property in target) {
				_revokeNested(_this, <proxyObjType<T>>target[<string | number>property]);
			}
			target[<string | number>property] = proxify({
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
				_revokeNested(_this, <proxyObjType<T>>target[<string | number>property]);
				delete target[<string | number>property];
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

	for (let property in <proxyObjType<T>>target) {
		(<proxyObjType<T>>target)[<string | number>property] = proxify({
			target: (<proxyObjType<T>>target)[<string | number>property],
			_this
		});
	}
	_this._revokes.set(revocable.proxy, revocable.revoke);
	return revocable.proxy;
}

export default function proxyStore<T>(value: proxyValueType<T>) {
	return new _proxyStore<T>({ value });
}
