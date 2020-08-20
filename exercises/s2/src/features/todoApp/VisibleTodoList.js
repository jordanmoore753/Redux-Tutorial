import { connect } from 'react-redux';
import React, { Component } from 'react';
import TodoList from './TodoList';
import * as actions from './actions';
import { getVisibleTodos, getIsFetching, getErrorMessage } from './todos';
import FetchError from './FetchError';

class VisibleTodoList extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.fetchData();
    }
  }

  fetchData() {
    const { filter, fetchTodos } = this.props;
    fetchTodos(filter);
  }

  render() {
    const { toggleTodo, todos, isFetching, errorMessage } = this.props;

    if (isFetching && !todos.length) {
      return <p>Loading...</p>;
    }

    if (errorMessage && !todos.length) {
      return (
        <FetchError 
          message={errorMessage}
          onRetry={() => this.fetchData()}
        />
      );
    }

    return (
      <TodoList 
        todos={todos}
        onTodoClick={toggleTodo} 
      />
    );
  }
}

const mapStateToTodoListProps = ( state, ownProps ) => {
  const filter = ownProps.filter || 'all';

  return { 
    todos: getVisibleTodos(state, filter),
    isFetching: getIsFetching(state, filter),
    errorMessage: getErrorMessage(state, filter),
    filter
  };
};

VisibleTodoList = connect(
  mapStateToTodoListProps,
  actions
)(VisibleTodoList);

export default VisibleTodoList;