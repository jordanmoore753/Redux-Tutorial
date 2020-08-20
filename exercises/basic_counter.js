const counter = (state = 0, action) => {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

let count = 1;

const add = {
  type: 'INCREMENT'
};

const subtract = {
  type: 'DECREMENT'
};

count = counter(count, add);

console.log(count === 2);

count = counter(count, subtract);

console.log(count === 1);

count = counter(count, {
  type: 'WHATEVER'
});

console.log(count === 1);