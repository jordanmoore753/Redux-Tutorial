import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = [
  { id: '0', name: 'Tianna Jenkins' },
  { id: '1', name: 'Kevin Grant' },
  { id: '2', name: 'Madison Poem' },
];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userAdded: {
      reducer(state, action) {
        const stateCopy = state.slice(0);
        stateCopy.push(action.payload);
        return stateCopy;
      },

      prepare(name) {
        return {
          id: nanoid(),
          name
        };
      }
    }
  }
});

export const { userAdded } = usersSlice.actions;
export default usersSlice.reducer;