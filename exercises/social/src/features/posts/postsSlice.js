import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = {
  posts: [],
  status: 'idle',
  error: null
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts');
  return response.posts;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },

      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0
            }
          }
        };
      }
    },

    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find(post => post.id === id);

      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },

    postRemoved(state, action) {
      const { id } = action.payload;

      for (let i = 0; i < state.posts.length; i += 1) {
        if (state.posts[i].id === id) {
          state.posts.splice(i, 1);
          return;
        }
      }
    },

    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      state.status = 'idle';

      const existingPost = state.posts.find(post => post.id === postId);

      if (existingPost) {
        existingPost.reactions[reaction] += 1;
      }
    }
  },

  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading';
    },

    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.posts = state.posts.concat(action.payload);
    },

    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    }
  }
});

export const { postAdded, postUpdated, postRemoved, reactionAdded } = postsSlice.actions;
export const selectAllPosts = state => state.posts.posts;
export const selectPostById = (state, postId) => {
  return state.posts.posts.find(post => post.id === postId);
};

export default postsSlice.reducer;