---
id: queries
title: Queries
---

## Query Basics

A query is a declarative dependency on an asynchronous source of data that is tied to a **unique key**. A query can be used with any Promise based method (including GET and POST methods) to fetch data from a server. If your method modifies data on the server, we recommend using [Mutations](https://azahi.vercel.app/guides/mutations) instead.

To subscribe to a query in your components, call the `useQuery` hook with at least:

- A **unique key for the query**
- A function that returns a promise that:
  - Resolves the data, or
  - Throws an error

```js
const info = this.azahi.useQuery('todos', fetchTodoList);
```

The **unique key** you provide is used internally for refetching, caching, and sharing your queries throughout your application.

The query results returned by `useQuery` contains all of the information about the query that you'll need for templating and any other usage of the data:

```js
const result = this.azahi.useQuery('todos', fetchTodoList);
```

The `result` object contains a few very important states you'll need to be aware of to be productive. A query can only be in one of the following states at any given moment:

- `isLoading` or `status === 'loading'` - The query has no data and is currently fetching
- `isError` or `status === 'error'` - The query encountered an error
- `isSuccess` or `status === 'success'` - The query was successful and data is available
- `isIdle` or `status === 'idle'` - The query is currently disabled (you'll learn more about this in a bit)

Beyond those primary states, more information is available depending on the state the query:

- `error` - If the query is in an `isError` state, the error is available via the `error` property.
- `data` - If the query is in a `success` state, the data is available via the `data` property.
- `isFetching` - In any state, if the query is fetching at any time (including background refetching) `isFetching` will be `true`.

For **most** queries, it's usually sufficient to check for the `isLoading` state, then the `isError` state, then finally, assume that the data is available and render the successful state:

```ts
// app.component.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public todosQuery$: UseQueryObservable<{ items: string[] }>;

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    this.todosQuery$ = this.azahi.useQuery('todos', () =>
      this.http.get('/api/data')
    );
  }
}
```

```html
// app.component.html
<ng-container *ngIf="todosQuery$ | async as query">
  <ng-container
    *ngIf="query.isLoading; then loading; else loaded"
  ></ng-container>
  <ng-template #loading>
    <p>Loading...</p>
  </ng-template>
  <ng-template #loaded>
    <ng-container *ngIf="query.error; else valid">
      An error has occurred: {{ todos.error['message'] }}
    </ng-container>
    <ng-template #valid>
      <ul>
        <li *ngFor="let item of query.data.items">{{ item }}</li>
      </ul>
      <div>{{ todos.isFetching ? 'Updating in background...' : ' ' }}</div>
    </ng-template>
  </ng-template>
</ng-container>
```

If booleans aren't your thing, you can always use the `status` state as well:

```html
// app.component.html
<ng-container *ngIf="todosQuery$ | async as query">
  <ng-container
    *ngIf="query.status === 'loading'; then loading; else loaded"
  ></ng-container>
  <ng-template #loading>
    <p>Loading...</p>
  </ng-template>
  <ng-template #loaded>
    <ng-container *ngIf="query.error; else valid">
      An error has occurred: {{ todos.error['message'] }}
    </ng-container>
    <ng-template #valid>
      <ul>
        <li *ngFor="let item of query.data.items">{{ item }}</li>
      </ul>
      <div>{{ todos.isFetching ? 'Updating in background...' : ' ' }}</div>
    </ng-template>
  </ng-template>
</ng-container>
```
