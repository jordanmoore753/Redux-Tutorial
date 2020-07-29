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