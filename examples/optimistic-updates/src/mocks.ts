import { rest, setupWorker } from 'msw';

let state = {
  items: [],
};

export const handlers = [
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(state))
  ),
  rest.post('/api/data', (req, res, ctx) => {
    state = {
      ...state,
      items: [...state.items, req.body],
    };
    return res(ctx.status(204));
  }),
];

export const worker = setupWorker(...handlers);
