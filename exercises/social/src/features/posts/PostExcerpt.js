import React from 'react';
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactButtons';

export const PostExcerpt = ({ post, onDeleteClick }) => {
	return (
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
	);
};