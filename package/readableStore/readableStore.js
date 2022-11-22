import CustomStore from '../CustomStore.js';
import SubscriberStore from './SubscriberStore/SubscriberStore.js';
class ReadableStore extends CustomStore {
    $hasSubscriber;
    constructor({ value }) {
        super({ value, hasSubscriber: true });
        this.$hasSubscriber = new SubscriberStore({ value: false, _this: this });
        return this;
    }
}
function readableStore(value) {
    return new ReadableStore({ value });
}
export default readableStore;
export { ReadableStore };
