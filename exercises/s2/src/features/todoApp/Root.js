import React from 'react';

const Root = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
);