import { combineReducers } from '@reduxjs/toolkit';
import todos, * as fromTodos from './todos';

export default combineReducers({
  todos
});

export const getVisibleTodos = (
  state,
  filter
) => fromTodos.getVisibleTodos(state.todos, filter);