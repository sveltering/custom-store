import { WritableStore } from '../writableStore.js';
class KeyValueStore extends WritableStore {
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
                _this.$store.set(target);
                return true;
            }
        });
        this.$store.set(this._proxy.value);
    }
}
function keyValueStore(value = {}) {
    return new KeyValueStore({ value });
}
export default keyValueStore;
export { KeyValueStore };
