import { _writableStore } from './writableStore.js';

export interface proxyObjType<T> {
	[key: string | number]: proxyValueType<T>;
}

export type proxyValueType<T> = T | proxyObjType<T>;

interface keyValueStoreConstructorOpts<T> {
	value: proxyValueType<T>;
}

type _proxyPropType<T> = { value: proxyValueType<T> };

export class _proxyStore<T> extends _writableStore<proxyValueType<T>> {
	declare _proxy: _proxyPropType<T>;
	declare _revokes: WeakSet<proxyObjType<T>>;
	constructor({ value }: keyValueStoreConstructorOpts<T>) {
		super({ value });
		this.value = value;
		let _this = this;
		this._destroys.push(() => {
			(<any>_this._revokes) = null;
			(<any>_this._proxy) = null;
		});
		return this;
	}

	protected _initProxy(value: proxyValueType<T>): void {
		this._revokes = new WeakSet();
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
let isProxyableType = function (a: unknown): boolean {
	return !!a && (a.constructor === Object || a.constructor === Array);
};

function _revokeNested<T>(_this: _proxyStore<T>, target: proxyValueType<T>): void {
	if (!isProxyableType(target)) {
		return;
	}
	if (_this._revokes.has(<proxyObjType<T>>target)) {
		for (let property in <proxyObjType<T>>target) {
			_revokeNested(_this, (<proxyObjType<T>>target)[<string | number>property]);
		}
		_this._revokes.delete(<proxyObjType<T>>target);
	}
}

interface proxifyOpts<T> {
	target: proxyValueType<T>;
	_this: _proxyStore<T>;
}

function proxify<T>({ target, _this }: proxifyOpts<T>) {
	if (!isProxyableType(target) || _this._revokes.has(<proxyObjType<T>>target)) {
		return target;
	}

	let proxy = new Proxy(<proxyObjType<T>>target, {
		set: function (target, property, value) {
			if (target[<string | number>property] === value) {
				return true;
			}
			_revokeNested(_this, target[<string | number>property]);
			target[<string | number>property] = proxify({
				target: value,
				_this
			});
			if (isArrayType(target) && property !== 'length') {
				return true;
			}
			_this.set(_this._proxy.value);
			return true;
		},
		deleteProperty(target, property) {
			if (!(property in target)) {
				return false;
			}
			_revokeNested(_this, target[<string | number>property]);
			delete target[<string | number>property];
			if (isArrayType(target) && property !== 'length') {
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
	_this._revokes.add(proxy);
	return proxy;
}

export default function proxyStore<T>(value: proxyValueType<T>) {
	return new _proxyStore<T>({ value });
}
