import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { postRemoved, selectAllPosts, fetchPosts } from './postsSlice';
import { PostExcerpt } from './PostExcerpt';

export const PostsList = () => {
  const posts = useSelector(selectAllPosts);
  const dispatch = useDispatch();
  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  const onDeleteClick = (e) => {
    const result = window.confirm('You want to delete this todo?');

    if (result) {
      dispatch(
        postRemoved({
          id: e.currentTarget.parentNode.id
        })
      );
    }
  };

  let content;

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>;
  } else if (postStatus === 'succeeded') {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    
    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} onDeleteClick={onDeleteClick} />
    ));
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};