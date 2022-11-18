import { writable, get } from 'svelte/store';
export default class _customStore {
    $store;
    _destroys = [];
    _setNull;
    _unsubscribes = [];
    constructor({ value, isWritable = true, hasSubscriber = false }) {
        let _this = this;
        let $store = writable(value, function start() {
            if (hasSubscriber) {
                _this.$hasSubscriber.$store.set(true);
            }
            return function stop() {
                _this._unsubscribes = [];
                if (hasSubscriber) {
                    _this.$hasSubscriber.$store.set(false);
                }
            };
        });
        if (isWritable) {
            this.$store = $store;
        } //
        else {
            this.$store = { subscribe: $store.subscribe };
        }
        this._setNull = () => {
            $store.set(null);
        };
        return this;
    }
    _unsubscribe(index) {
        this._unsubscribes[index]?.();
        this._unsubscribes[index] = null;
    }
    subscribe(callback) {
        let unsubscribe = this.$store.subscribe(callback);
        let unsubscribeIndex = this._unsubscribes.length;
        this._unsubscribes.push(unsubscribe);
        let _this = this;
        return () => {
            _this._unsubscribe(unsubscribeIndex);
        };
    }
    unsubscribeAll() {
        for (let i = 0, iLen = this._unsubscribes.length; i < iLen; i++) {
            this._unsubscribe(i);
        }
        this._unsubscribes = [];
        return this;
    }
    _runDestroys() {
        for (let i = 0, iLen = this._destroys.length; i < iLen; i++) {
            this._destroys[i]?.();
            this._destroys[i] = null;
        }
        this._destroys = [];
    }
    purge() {
        this.unsubscribeAll();
        this._runDestroys();
        this._setNull();
        let properties = Object.getOwnPropertyNames(this);
        for (let i = 0, iLen = properties.length; i < iLen; i++) {
            delete this[properties[i]];
        }
    }
    get() {
        return get(this.$store);
    }
}
