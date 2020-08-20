import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users');
  return response.users;
});

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
  },

  extraReducers: {
    [fetchUsers.fulfilled]: (state, action) => {
      return action.payload;
    }
  }
});

export const { userAdded } = usersSlice.actions;
export default usersSlice.reducer;