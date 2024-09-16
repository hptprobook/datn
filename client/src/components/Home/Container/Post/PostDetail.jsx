import React from 'react';
import { useParams } from 'react-router-dom';
import { posts } from '~/APIs/mock_data';
import PostLayout from '~/layouts/PostLayout';

export default function PostDetail() {
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);

  if (!post) {
    return <div>Post not found</div>;
  }

  console.log('Post content:', post.content); // Debugging line

  return (
    <PostLayout>
      <div className="mt-12">
        <h2 className="text-2xl text-center font-bold text-red-600">
          {post.title}
        </h2>
        <div className="mt-8">
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
          <p className="text-slate-700 font-normal text-sm mt-4">
            {post.content}
          </p>
        </div>
      </div>
    </PostLayout>
  );
}
