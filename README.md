# custom-stores
> An abstract class upon which to create custom store functionality



## Properties

### `.value` - getter/setter
```typescript
let value  = store.value //value will be the current store value
store.value = "new value" //sets the new store value
```

### `.store` - getter
```typescript
let $store  = store.store //gets the svelte store object 
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

