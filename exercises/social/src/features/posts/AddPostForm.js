import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { postAdded } from './postsSlice';

export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  const dispatch = useDispatch();
  const users = useSelector(state => state.users);

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onUserIdChanged = e => setUserId(e.target.value);

  const onSavePostClicked = () => {
    if (canSave) {
      dispatch(postAdded(title, content, userId));
      setTitle('');
      setContent('');
    }
  };

  const canSave = title && content && userId;

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='postContent'>Post Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <label htmlFor='postAuthor'>Posting Author:</label>
        <select id="postAuthor" value={userId} onChange={onUserIdChanged}>
          <option value=""></option>
          {userOptions}
        </select>
        <button 
          type='button'
          onClick={onSavePostClicked}
          disabled={!canSave}
        >Save Post
        </button>
      </form>
    </section>
  );
};