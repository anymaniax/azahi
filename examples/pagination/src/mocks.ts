import { rest, setupWorker } from 'msw';

export const handlers = [
  rest.get('/api/projects', async (req, res, ctx) => {
    console.log(req);
    // eslint-disable-next-line radix
    const page = parseInt(req.url.searchParams.get('page')) || 0;

    const pageSize = 10;

    const projects = Array(pageSize)
      .fill(0)
      .map((_, i) => {
        const id = page * pageSize + (i + 1);
        return {
          name: 'Project ' + id,
          id,
        };
      });

    await new Promise((r) => setTimeout(r, 1000));
    return res(ctx.status(200), ctx.json({ projects, hasMore: page < 9 }));
  }),
  rest.get('/api/todos', async (req, res, ctx) =>
    res(ctx.status(200), ctx.json([]))
  ),
];

export const worker = setupWorker(...handlers);
