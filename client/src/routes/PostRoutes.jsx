import { lazy } from 'react';

// Lazy load the PostDetail component
const PostDetail = lazy(() => import('../components/Home/Container/Post/PostDetail'));

const PostRoutes = {
  path: '/post',
  children: [
    {
      path: ':id',
      element: <PostDetail />
    }
  ]
};

export default PostRoutes;