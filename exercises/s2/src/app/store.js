import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import todoReducer from '../features/todoApp/todos';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

const configureStore = () => {
  const middlewares = [];

  middlewares.push(thunk);
  middlewares.push(createLogger);

  return createStore(todoReducer, applyMiddleware(...middlewares));
};


export default configureStore;
