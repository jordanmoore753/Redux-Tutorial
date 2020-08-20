# Redux **Egghead** Tutorial

## The Single Immutable State Tree

In applications that have a lot of state to keep track of, and this state is used by many different components in possibly separate routes, it may make sense to use Redux.

The first idea behind is Redux is that all state that needs to be shared across the application is kept in a single object called the **state tree**. From here, every component can access the state through methods on the `store`.

## Describing State Changes with Actions

The state tree is redundant. You cannot modify or write to it.

You must dispatch an **action** which communicates the changes which must be made to the state tree. An action is a JS object with information on what to change about the state tree. It will contain a field `type` which details which kind of change it is, and an optional `payload` field which contains the value to replace.

The components only communicate the actions to the store. They do not know how the state tree is changed. The store handles all of that logic. Any data which reaches the store (Redux application) gets there through actions from the components (views).

Here's an example action:

```jsx
// simple counter
-
const action = {
  type: 'INCREMENT'
};

// adding todo

const addTodo = {
  type: 'ADD_TODO',
  text: 'Buy almond milk',
  id: 0
}

// removing todo

const removeTodo = {
  type: 'REMOVE_TODO',
  id: 0
};
```
## Redux uses Pure Functions

Pure functions are functions that:

1. Have no side effects.
2. Return value is always the same given the same arguments.
3. Do not modify the inputs (mutate).

## Reducer Function

The UI is most predictable when defined as a pure function.

State mutations need to be described as a pure function that takes as its arguments:

1. The previous state, `state`.
2. The action object, `action`.

The reducer function returns the new state object (after creating new object based on `action`).

## The Store

The store has three methods which bind the three major functions of Redux:

1. State must be stored and re-assigned in top-level Redux.
2. Actions must be dispatched to the store from views (components).
3. Components must be notified of changes to the state in Redux so that successful re-rendering can occur.

These methods are: `getState && dispatch && subscribe`.

`getState` returns the current state tree.

`dispatch` dispatches action objects from the components to the store.

`subscribe` lets you specify callback functions to be invoked when an action is dispatched to the store.

## Reducer Composition

Reducers are used to update the state tree. The store takes a reducer function upon instantiation that describes how to update the state tree; however, sometimes, one reducer function is not enough to separate concerns of different parts of the state tree being updated.

For instance, our todo application has two main pieces of state: the todo list and the actual todo objects. We should separate these state updates into two separate reducer functions, with the list of todos being the reducer passed into the store, and the todo reducer being invoked by that aforementioned reducer to update specific todos.

In this part, we only refactored the todos list and specific todo updates into separate reducers: `todos` and `todo`.

## Reducer Composition into Object

In any todo list, we probably want to be able to filter which todos to look at. Completed, active, incomplete, or all are typical options. With our current state tree, it is impossible to narrow down the view criteria.

We can refactor the state tree to be stored in an object instead and let the separate reducers be invoked to update their part of the state tree. We will have a top level reducer, `todoApp`, which manages state tree updates for the entire application. This reducer includes state updates for all state, but it outsources the logic of the update to separate reducer functions. This is done to prevent one reducer function from becoming clunky and overused.

```js
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return Object.assign({}, state, {
        completed: !state.completed
      });
    default:
      return state;        
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      const newState = [...state];
      const newTodo = todo(undefined, action)

      newState.push(newTodo);
      return newState;
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  };
};

const { createStore } = Redux;
const store = createStore(todoApp);

store.dispatch({ type: 'ADD_TODO', id: 0, text: 'Doritos' });
store.dispatch({ type: 'TOGGLE_TODO', id: 0 });
store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: 'sHOW_COMPLETED' });
```
The store is passed `todoApp`, where the state is by default a `{}`. Then, anytime the store is dispatched an action, the store will invoke the reducer function with that given `action` object. The reducer function `todoApp` specifies to update certain properties, like `todos` and `visibilityFilter` with the use of two separate reducers, `todos` and `visibilityFilter`. 

Only the relevant properties are updated if an action object with the correct `type` property is passed; otherwise, the initial state is returned.

## Don't do it yourself, use combineReducers

We manually wrote out the `todoApp` reducer. For our application it wasn't arduous to write since it is a small reducer function with a limited number of properties.

However, for larger or more error-prone reducer functions, we can use `combineReducers` to automate the creation of the reducer function.

```js
const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});
```
Here, the state is created by looking at the properties passed to `combineReducer`'s object. The state tree will have `todos` property and `visibilityFilter` property. Both of these properties have values equivalent to the return value of their separate reducer function. 

Now, the store has this top-level reducer function which manages and updates the state tree through outsourcing and separating concerns. 