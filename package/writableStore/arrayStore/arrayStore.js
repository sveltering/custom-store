import { _writableStore } from '../writableStore.js';
class _arrayStore extends _writableStore {
    constructor({ value }) {
        super({ value });
        return this;
    }
    _initProxy(value) {
        let _this = this;
        this._proxy = {};
        this._proxy.value = new Proxy(value, {
            set: function (target, property, value) {
                target[property] = value;
                if (property === 'length') {
                    _this.$store.set(target);
                }
                return true;
            }
        });
        this.$store.set(this._proxy.value);
    }
}
export default function arrayStore(value = []) {
    return new _arrayStore({ value });
}