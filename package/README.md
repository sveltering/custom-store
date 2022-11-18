# custom-stores
> Stores like never done before (Disclaimer: I havn't checked). Extends on sveltes' own store implementation


# Readable store
> Implementation not 100% complete. 
>  Store value can't be changed once initated, rendering current usbaility - useless.
> 
> **HOWEVER** - All other stores use the same properties and methods

## Install and import
```console
npm -i @sveltering/custom-store
```
```typescript
import { readableStore } from '@sveltering/custom-store';

let store = readableStore(/*value*/)
```

## Properties

### `.value` - getter
Gets the current store value
```typescript
let store  = readableStore("Store value") //value will be the current store value
store.value // "Store value"
```

### `.store` - getter
Gives direct access to svelte store object
```typescript
let $store  = store.$store // { subscribe:  fn }
```



## Methods

### `.subscribe(callback: Subscriber<T>): Unsubscriber`
>Used in same way as default store functionality and returns unsubscribe function. Allows for autosubscription also.
```typescript
store.subscribe(value => console.log(value));
```

### `.destroy(): void`
>unsubscribes from all subscriptions and removes all properties on self/this
```typescript
store.destroy()
```

### `.subscriptionChange(callback: subscriptionWatcher): this`
>Function is called on first subscription and last unsubscription
```typescript
store.subscriptionChange((hasSubscriber) =>{
    console.log(hasSubscriber ? "Hooray !" : "No subscribers :(");
})
```

