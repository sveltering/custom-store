import _customStore from '../customStore.js';
import subscriberStore from './subscriberStore/subscriberStore.js';
export class _readableStore extends _customStore {
    $hasSubscriber;
    constructor({ value }) {
        super({ value, hasSubscriber: true });
        this.$hasSubscriber = new subscriberStore({ value: false, _this: this });
        return this;
    }
}
export default function readableStore(value) {
    return new _readableStore({ value });
}
