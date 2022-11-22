import CustomStore from '../CustomStore.js';
import SubscriberStore from '../readableStore/SubscriberStore/SubscriberStore.js';
class WritableStore extends CustomStore {
    $hasSubscriber;
    constructor({ value }) {
        super({ value, hasSubscriber: true });
        this.value = value;
        let _this = this;
        this.$hasSubscriber = new SubscriberStore({ value: false, _this });
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
        this._initProxy(callable(this._proxy.value));
        return this;
    }
}
function writableStore(value) {
    return new WritableStore({ value });
}
export default writableStore;
export { WritableStore };
