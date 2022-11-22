import { WritableStore } from '../writableStore.js';
class ArrayStore extends WritableStore {
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
function arrayStore(value = []) {
    return new ArrayStore({ value });
}
export default arrayStore;
export { ArrayStore };
