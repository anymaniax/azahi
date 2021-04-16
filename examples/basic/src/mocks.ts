import { rest, setupWorker } from 'msw';
import { Post } from './app/app.types';

let state = {
  posts: [
    {
      id: 1,
      title: 'Post one',
    },
    {
      id: 2,
      title: 'Post two',
    },
    {
      id: 3,
      title: 'Post three',
    },
  ],
};

export const handlers = [
  rest.get('/api/posts', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(state))
  ),
  rest.get('/api/posts/:postId', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(state.posts.find((post) => post.id === +req.params.postId))
    )
  ),
  rest.post<Post>('/api/posts', (req, res, ctx) => {
    state = {
      ...state,
      posts: [...state.posts, req.body],
    };
    return res(ctx.status(204));
  }),
];

export const worker = setupWorker(...handlers);
