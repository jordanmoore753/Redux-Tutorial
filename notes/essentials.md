# Redux Essentials

## What is Redux?

**Redux** is a pattern and library for managing and updating application state, using events called **actions**.

It is a centralized store for state that needs to be used **across the entire application**. This store can also set rules for regulating the updating of state.

The state that is managed by Redux is **global** state. Global state is the type of state that is needed across all parts of the application. The goal of Redux is to make the developer aware of when, where, why, and how the state in an application is being updated, and how the application logic behaves in response.

### When Should I Use Redux?

Redux should be used when:

1. There is a large amount of application state needed in many places thorought the application.
2. The app state is updated frequently.
3. The logic to update the state may be complex.
4. The app has a medium to large-size codebase and may be worked on by many people.

Redux shouldn't be used when:

1. There isn't much state shared across the application.
2. App state is updated infrequently.
3. The application is small.

### Redux is a library

Redux is a standalone JS library. Normally, it is used with other packages.

One is **React-Redux**. Redux can integrate with any UI framework, and is most commonly used with React. This package lets React components interact with a Redux store by reading pieces of state and dispatching actions to update the store.

**Redux Toolkit** is the recommended approach for writing Redux logic. It contains packages and functions that are essential for building a Redux app. This toolkit builds according to best practices, simplifies Redux tasks, prevents common mistakes, and makes Redux easier to write.

### Flow

React uses a one-way data flow with **state, actions, and views**.

State describes the condition of the app at a certain point in time, and the UI is rendered based on that state. User actions update the state, which then re-renders the view. Each part affects the other one in a certain one-way flow.

One-way data flow is a problem when the components need to share and use the same state, and when they are located in separate parts of the application.

The main way to solve this problem is to lift state up to the parent, but sometimes that doesn't help either.

This is where come to Redux: extracting shared state from the components and placing it in a **centralized location outside the component tree**. From here, the component tree becomes a large **view**, and the components in that view can access state or trigger actions no matter the location in the tree.

### Terms

Redux uses specific terms to describe things.

#### Actions

An **action** is a JS object that has a `type` field. An action is an event that describes something that happened in the application.

The `type` field should be a string that describes the action with a name.

The `payload` field is used when the object needs to store additional information about what happened with the action.

In this example, the `addTodoAction` is an action that describes the `todo` object that was created by a form submission. The `type` describes the action, which is that a todo was added, and the `payload` is the body of the todo object.

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy almond milk'
};
```
#### Action Creators

An **action creator** is a function that creates and returns an action object. As one can see, writing the action object above would be time-consuming and cumbersome; it's better to outsource action creation to a consistent function.

```jsx
const addTodo = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  };
};
```
Now, we can assign the `milk` todo variable to point at the return value of `addTodo`. This is how we create the `milk` action.

```jsx
const almondMilkTodo = addTodo('Buy almond milk.');

almondMilkTodo.type;    // 'todos/todoAdded'
almondMilkTodo.payload; // 'Buy almond milk.'
```
#### Reducers

A **reducer** is a function that receives the **current state** and the **action** object. Then, it decides how to update the state if necessary, and **returns the new state**. 

Reducers are functional. This means they follow certain rules:

1. They only calculate new state value with **state and action** arguments.
2. They cannot modify existing state. Updates must be immutable instead. Original state is copied and then the copy is mutated.
3. They cannot perform asynchronous logic, calculate random values, or cause side effects.

The flow of a reducer is as follows:

1. Check to see if reducer cares about this action (it will mutate state).
2. If so, make a copy of the state and update the copy with new values, then return it.
3. If not, return initial state.

#### Store

The **store** is where the application state lives. It's an object.

The store is created by passing in a reducer. The store has a method, `getState`, which returns the current state value.

```jsx
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({ reducer: counterReducer });

store.getState(); // { value: 0 }
```
#### Dispatch

The **store** has a method called `dispatch`. The only way to update state is to call `store.dispatch()` and pass in an action object. The store runs the reducer function and saves the new state value inside. Then, `getState` can be called to retrieve the updated value.

```jsx
store.dispatch({ type: 'counter/increment' });
store.getState(); // { value: 1 }
```
Dispatching actions is like triggering an event. Reducers act like event listeners on the store. When they hear an action, they update the state in response.

Typically, action creators are invoked to dispatch the correct action.

```jsx
const decrement = () => {
  return {
    type: 'counter/decrement'
  };
};

store.dispatch(decrement());
store.getState(); // { value: -1 }
```
> I'm guessing that passing in the reducer to the `store` configuration places the reducer function in context of the store, making it available to update the state automatically.

#### Selectors

**Selectors** are functions that extract pieces of information from a store's state value. 

```jsx
const selectCounterValue = state => state.value;
const currentValue = selectCounterValue(store.getState());
currentValue; // -1
```
## Redux Application Data Flow

Let's review the flow of data in typical React app:

1. State is created.
2. View is populated with the stateful data.
3. Actions from the user affect the state, requiring view to update.

Now, with redux, we can break the steps into more detail:

**Initial Setup**:

- A Redux store is created using a reducer function (called the root reducer function).
- The store calls the root reducer function once and saves the return value as initial state.
- On UI's first rendering, UI components access the state of Redux store and use that data to decide what to render. They also subscribe to any future store updates so they can know if the state is changed.

**Updates**:
- Something happens in the application, like User hovering over something or a button click.
- The app dispatches an action to the Redux store, like: `dispatch({ type: 'todos/addTodo' })`.
- The store runs the reducer function again with the previous state and current action object. Then, the return value is saved as new state.
- Store notifies all listeners of the UI (subscribed components) that the store has been updated.
- Each UI component that needs store data checks to see if parts of the state they need have changed.
- Each component whose data has changed forces a re-render with the new data. 

# Redux App Structure

Using a Redux Store requires a different structure from traditional React applications.

## App Contents

In general, the store is included as `store.js` in the `app` directory of `src`.

The separate components which inherit state from the store are in `features` of the `src` directory.

`App.js` is still our top-level React component, and `index.js` is the starting point for the application.

## Creating the Redux Store

`store.js` can look like this:

```jsx
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export default configureStore({
  reducer: {
  	counter: counterReducer
  }
});
```
Redux stores are created with the `configureStore` function and must be passed a reducer. Since the app will have many features, and each feature may have its own reducer function, we pass in an object with all of the different reducers stored as key-value pairs. The key is the name of the reducer and the value is reducer function.

In this example, we pass in a `counter` key with the value `counterReducer`. We are saying we want the `state` object in the Redux store to have a `counter` property, and that `counterReducer` is in charge of handling any dispatched actions to the `counter` state.

### Redux Slices

A **redux slice** is a collection of Redux reducer logic and actions for a single feature in an app. This explains why the counter reducer function is named `counterSlice`.

```jsx
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';
import postsReducer from '../features/posts/postsSlice';

export default configureStore({
  reducer: {
  	users: usersReducer,
  	posts: postsReducer
  }
});
```
With this example, we've set up state for `users` and `posts` on the store's `state` object. You could say that `users` and `posts` are each 'slices' of the state in the application.

### Creating Slice Reducers and Actions

Let's look at `counterSlice` and break it down.

```js
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCount = state => state.counter.value;

export default counterSlice.reducer;
```
There are three different types of action types associated with `counter`: increment, decrement, and increment by a certain amount. There does not appear to be any action objects inside of `counterSlice`, though, so we're left wondering: where are the action creators and objects defined?

The `createSlice` function is a function of Redux Toolkit which generates action type strings, action creator functions, and even action objects. All you have to do is type a name for the slice, write an object that has the reducer functions in it, and it automatically generates the action code accordingly.

The `name` string is used as the first part of each action type. So, increment's action type would be `counter/increment`, for instance. In the action object, it looks like so:

```js
const object = {
	type: 'counter/increment'
};
```
So, the `counterSlice` automatically has an `actions` property with the action creator functions as the same name as each reducer function.

### Rules of Reducers

Friendly reminder! Reducers follow these special rules:

- They only calculate new state value based on two arguments: `state && action`, the latter being an action object created by an action creator function.
- They are not allowed to modify existing state. They must make a copy of the state and then perform the change on the copy, reassigning the store's state to the return value of the reducer after.
- They cannot do async logic or side effects.

This makes reducers functional, meaning that given the same arguments the return value will always be the same. They should be pure and without side effects. The rules of reducers are in place to make your life easier, as side effects make the application unreliable. Being able to rely on the same return value and no mutating of the state object from outside of the `store` makes our Redux applications consistent.

#### Creating Copies Easily with `createSlice`

Sure, the rules of reducers are good, but doesn't it take a lot of time to manually create copies of the state whenever we need to update it?

Yes, but we don't need to do it by hand. `createSlice` can do it for us if we want.

The `immer` library that `createSlice` uses makes it possible. It provides a tool named `Proxy` which wraps provided data and lets you write code to 'mutate' the wrapped data. The difference here is that Immer keeps track of all the changes that are made, and then uses that list of changes to return a safely immutably updated value to return to the store. 

Here's a by-hand example:

```jsx
function hand(state, action) {
	return {
		...state,
		first: {
			...state.first,
			second: {
				...state.first.second,
				[action.someId]: {
					...state.first.second[action.someId],
					fourth: action.someValue
				}
			}
		}
	}
}
``` 
That looks pretty similar to callback hell. See how messy it gets with deeply nested objects in state? Let's refactor it with Immer.

```jsx
function reducerWithImmer(state, action) {
	state.first.second[action.someId].fourth = action.someValue;
}
```
> You must have Redux Toolkit in order to write mutating logic with Immer without actually mutating state.

### Writing Async Logic with Thunks

A **thunk** is a kind of Redux function that can contain async logic. Thunks are written in two functions:

- The inside thunk function, which gets `dispatch` and `getState` as arguments.
- The outside creator function, which creates and returns the thunk function.

Here's a thunk.

```jsx
export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};
```
This is a thunk. The `dispatch` invocation only occurs after 1 second. This is asynchronous. 

Here's another example:

```jsx
const fetchById = userId => {
	return async (dispatch, getState) => {
		try {
				const user = await userAPI.fetchById(userId);
				dispatch(userLoaded(user));
			} catch (err) {
				// something went wrong!
			}
	};
};
```
The outside creator function is `fetchById` and the thunk function is `async (dispatch, getState)`. The function is returned from here and invoked by the `store` object: `store.dispatch(incrementAsync(5))`.

### The React Counter Component

Let's look at `Counter.js`.

```jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';

export function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={e => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() =>
            dispatch(incrementByAmount(Number(incrementAmount) || 0))
          }
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
        >
          Add Async
        </button>
      </div>
    </div>
  );
}
```
The current counter value is not being stored as state in `counter`. Rather, it is being retrieved and stored in the `count` variable with the `useSelector` function invocation. This function is retrieving `state.counter.value` from the Redux store.

> Selector functions take `state` as an argument and return some part of the state value.

```jsx
export const selectCount = state => state.counter.value;
```
As one can see, `selectCount` retrives the `state.counter.value` value. We must outsource the selector to talk to the Redux store because components cannot talk to the store directly, since we cannot import the store into component files.

Additionally, since we do not have access to the `store` object in our components, we cannot dispatch actions. The `useDispatch` hook allows us to retrieve the `dispatch` object with all the possible action creators from the store.

```jsx
const dispatch = useDispatch();

// now, we can do the following in components:

<a 
	onClick={() => dispatch(increment())}
/>
```
### How to Determine where State should be

Global state should be stored in the Redux store and local state should be stored in the component state.

But how do we know where to put `input` state? Or other state not mentioned so far?

Here are some guiding questions:
- Do other parts of the app care about this data? (Global)
- Do you need to be able to create further derived data based on this original data? (Global)
- Is the same data driving multiple components? (Global)
- Is there value to you in being able to restore the state to a given point of time? (Global)
- Do you cache the data? (Global)
- Do you want to keep the data consistent while hotloading the UI? (Global)

Most form state should be kept in the component. The flow for form control with Redux is:

- Store the data in form components as state.
- Dispatch Redux actions to update the store when the user is done with the form.

### Providing the Store

Our components communicate with the store through `useSelector` and `useDispatch` hooks. How is the store provided to the hooks?

The answer lies in `index.js`, the starting point of the application.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```
`Provider` is a component which passes the Redux store to the hooks behind the scenes.

## Summary

Wow! Redux is **complicated** at first glance. I'm excited to get started on developing muscle memory with the various paradigms in Redux. Here's a basic summary of these notes so far:

1. `configureStore` is used to create the Redux store.
- It must be passed a `reducer` function.
- It automatically sets up the store with reliable defaults.
2. Redux logic is organized into files called `slices`.
- Slices contain reducer logic and actions for a specific feature.
- `createSlice` generates action creators and action types for each individual reducer function provided.
3. Reducers follow rules.
- No side effects allowed.
- Cannot mutate state directly, must make copy and update copy.
- No async logic allowed. 

# Async with Thunks

Since reducers cannot have async logic inside of them, there needs to be another way to incorporate the use of asynchronous logic alongside the updating of state.

**Thunks** are the solution to this problem. A thunk is a special kind of function which accepts the arguments `dispatch && getState`. The `dispatch` is the connection to the `store` that lets the thunk dispatch an action and update the state. The normal flow of a thunk is:

1. Thunk function is invoked.
2. A start action is dispatched before the asynchronous request. This indicates the state of the request: finished, in progress, cancelled, etc. This is optional but recommended to disable duplicate requests.
3. The async request is made.
4. The async response is evaluated and an appropriate **action** is dispatched in response. 

Of course, these steps are optional. But this is the normal, common flow of a thunk function.