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
    _insert_index(after = true, needleIndex, ...values) {
        if (needleIndex < 0) {
            return this;
        }
        let sliceFrom = after ? needleIndex + 1 : needleIndex;
        let array1 = this.value.slice(0, sliceFrom);
        let array2 = this.value.slice(sliceFrom);
        this.value = [...array1, ...values, ...array2];
        return this;
    }
    _insert(after = true, first = true, needle, ...values) {
        let needleIndex = first ? this.value.indexOf(needle) : this.value.lastIndexOf(needle);
        return this._insert_index(after, needleIndex, ...values);
    }
    addAfter(needleIndex, ...values) {
        return this._insert_index(true, needleIndex, ...values);
    }
    addBefore(needleIndex, ...values) {
        return this._insert_index(false, needleIndex, ...values);
    }
    addAfterFirst(needle, ...values) {
        return this._insert(true, true, needle, ...values);
    }
    addBeforeFirst(needle, ...values) {
        return this._insert(false, true, needle, ...values);
    }
    addAfterLast(needle, ...values) {
        return this._insert(true, false, needle, ...values);
    }
    addBeforeLast(needle, ...values) {
        return this._insert(false, false, needle, ...values);
    }
    _remove_first_last(first, value) {
        let index = first ? this.value.indexOf(value) : this.value.lastIndexOf(value);
        if (index > -1) {
            this.value.splice(index, 1);
        }
        return this;
    }
    removeFirst(value) {
        return this._remove_first_last(true, value);
    }
    removeLast(value) {
        return this._remove_first_last(false, value);
    }
    removeEvery(value) {
        this.value = this.value.filter((x) => x !== value);
        return this;
    }
    remove(index) {
        this.value.splice(index, 1);
        return this;
    }
    pluck(index) {
        let plucked = this.value.splice(index, 1);
        return plucked.length ? plucked[0] : undefined;
    }
}
function arrayStore(value = []) {
    return new ArrayStore({ value });
}
export default arrayStore;
export { ArrayStore };
