import customStore from '../../customStore.js';
export default class subscriberStore extends customStore {
    constructor({ value, _this }) {
        super({ value });
        this._destroys.push(() => _this.$hasSubscriber.purge());
        return this;
    }
}
