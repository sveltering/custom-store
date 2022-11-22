import CustomStore from '../../CustomStore.js';
class SubscriberStore extends CustomStore {
    constructor({ value, _this }) {
        super({ value });
        this._destroys.push(() => _this.$hasSubscriber.purge());
        return this;
    }
}
export default SubscriberStore;
