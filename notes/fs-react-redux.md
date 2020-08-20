# Redux, as told by *FullStack React*

## Redux's key ideas

**Redux** is an implementation of Flux. It has several key features:

- All application data is held in a single data structure called **state** and **state** is held in the **store**.
- The application reads state from the store.
- The state is **never mutated** directly outside of the store. The store handles the mutations through reducers.
- The views emit actions that describe what happened.
- New state is created by combining old state and the action by a function called a **reducer**.

## Counter project

We're going to create a Counter application. Let's think back to the general flow of a React application which uses Redux.

An **action** is emitted from a view. The **action** is then dispatched to the store. Any necessary updates are made to the relevant **state** in the store. Then, the **view** is re-rendered based on the updated **state** in the **store**.

Action => Dispatcher => Store => View (and loop!)

### What happens in the store?

The stores uses a **reducer function** to process the action that was dispatched to it. The store provides the reducer function with the current **state** and **action** passed to it. The reducer function then **returns the new state**.

### What does the reducer look like?

We'll break down a reducer's look through the Counter's reducer function.

A reducer function takes `state && action` as arguments. `action` is an object with a `type` property and an optional `payload` or `meta` properties. The `payload` typically has as its value the value that will be used to modify the state in some way.

### Store

The store is responsible for both maintaining the state and accepting actions from the view. Only the store has access to the reducer!

The **action** comes from outside of the store. It is dispatched there. The store supplies the current **state** to the **reducer function**, which is also provided by the **store**. The reducer returns the **next state**.

Let's create our own version of `createStore`, which is the function used to create the store in Redux.

```js
function createStore(reducer) {
  let state = 0;

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
  };

  return {
    getState,
    dispatch
  };
}
```
First, the store sets the `state` to `0`. Stores will set the state based on some data most likely in other applications. This data is private to the store and can only be read and updated via controlled methods. 

`getState` is the method used to retrieve the current state in the store. 

`dispatch` is the method we use to dispatch a certain action to the store, invoking the `reducer` function and thereby re-assigning the state object to a new value.

We return the object with references to `getState && dispatch` because we need an object that can invoke these methods at any time during the application's execution. `state && reducer` are held in reference and not garbage collected because references to them exist through the `getState` and `dispatch` methods within their closure.

### The core of Redux

Now that we've seen how the store and reducers work on a high level, let's revisit the core ideas of Redux.

The first core idea of Redux is that all of the application's data is held in a single data structure called the state. The state object is held in the store. 

The application, thereby, reads the state from the store.

Since the state variable is private, the application cannot directly mutate the state object. Rather, the application can dispatch actions to the store, which invoke the reducer function associated with that particular action object. The application emits actions through the views.

In the reducer, new state is created by combining the old state and the action. This is the primary job of the reducer function.

Reducer functions are pure functions.

# Chat Application

We're going to build a basic chat application using React and Redux.