import { _writableStore } from '../writableStore.js';
export class _proxyStore extends _writableStore {
    constructor({ value }) {
        super({ value });
        return this;
    }
    _initProxy(value) {
        this._proxy = { value };
        this._proxy = proxify({
            target: this._proxy,
            _this: this
        });
        this.$store.set(this._proxy.value);
    }
}
let isProxyableType = function (obj) {
    return !!obj && (obj.constructor === Object || obj.constructor === Array);
};
function proxify({ target, _this }) {
    return new Proxy(target, {
        get: function (target, property) {
            if (property === '_$$isProxyStore') {
                return true;
            }
            if (!target[property]?._$$isProxyStore &&
                target.hasOwnProperty(property) &&
                isProxyableType(target[property])) {
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
export default function proxyStore(value) {
    return new _proxyStore({ value });
}
