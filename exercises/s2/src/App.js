import './App.css';
import React from 'react';
import VisibleTodoList from './features/todoApp/VisibleTodoList';
import AddTodo from './features/todoApp/AddTodo';
import Footer from './features/todoApp/Footer';

const App = ({ match }) => (
  <div>
    <AddTodo />
    <VisibleTodoList 
      filter={match.params.filter || 'all'}
    />
    <Footer />
  </div>
);

export default App;
