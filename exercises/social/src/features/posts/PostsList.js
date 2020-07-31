import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { postRemoved } from './postsSlice';
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactButtons';

export const PostsList = () => {
  const posts = useSelector(state => state.posts);
  const dispatch = useDispatch();

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

  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  const renderedPosts = orderedPosts.map(post => (
    <article className="post-excerpt" id={post.id} key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.user} />
      <p>{post.content.substring(0, 100)}</p>
      <TimeAgo timestamp={post.date} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
      <button
        type="click"
        onClick={onDeleteClick}
      >Delete Post
      </button>
      <ReactionButtons post={post} />
    </article>
  ));

  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  );
};