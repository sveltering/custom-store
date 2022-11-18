import _customStore from '../customStore.js';
import subscriberStore from '../readableStore/subscriberStore/subscriberStore.js';
export class _writableStore extends _customStore {
    $hasSubscriber;
    constructor({ value }) {
        super({ value, hasSubscriber: true });
        this.value = value;
        let _this = this;
        this.$hasSubscriber = new subscriberStore({ value: false, _this });
        this._destroys.push(() => (_this._proxy = null));
        return this;
    }
    _initProxy(value) {
        this._proxy = { value: value };
        this.$store.set(this._proxy.value);
    }
    set value(value) {
        this._initProxy(value);
    }
    get value() {
        return this._proxy.value;
    }
    set(value) {
        this._initProxy(value);
        return this;
    }
    update(callable) {
        this.value = callable(this.value);
        return this;
    }
}
export default function writableStore(value) {
    return new _writableStore({ value });
}
