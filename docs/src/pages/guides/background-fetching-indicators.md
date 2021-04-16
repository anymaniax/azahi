---
id: background-fetching-indicators
title: Background Fetching Indicators
---

A query's `status === 'loading'` state is sufficient enough to show the initial hard-loading state for a query, but sometimes you may want to display an additional indicator that a query is refetching in the background. To do this, queries also supply you with an `isFetching` boolean that you can use to show that it's in a fetching state, regardless of the state of the `status` variable:

```markdown
<script>
  import { useQuery } from 'azahi';

  const queryResult = useQuery('todos', fetchTodos)
</script>

{#if $queryResult.status === 'loading'}
  <span>Loading...</span>
{:else if $queryResult.status === 'error'}
  <span>Error: {$queryResult.error.message}</span>
{:else}
{#if $queryResult.isFetching}

<div>Refreshing...</div>
{/if}
{#each $queryResult.data as todo}
<Todo {todo} />
{/each}
{/if}
```

```ts
// app.component.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  todosQuery$: UseQueryObservable;

  constructor(private azahi: Azahi) {}

  ngOnInit(): void {
    this.todosQuery$ = this.azahi.useQuery('todos', fetchTodos);
  }
}
```

```html
// app.component.html
<ng-container *ngIf="todosQuery$ | async as query">
  <ng-container *ngIf="query.status === 'loading'; else loaded">
    <p>Loading...</p>
  </ng-container>

  <ng-template #loaded>
    <ng-container *ngIf="query.status === 'error'; else valid">
      An error has occurred: {{ query.error['message'] }}
    </ng-container>
    <ng-template #valid>
      <div *ngIf="query.isFetching">Refreshing...</div>
      <ul>
        <li *ngFor="let item of query.data.items">{{ item }}</li>
      </ul>
    </ng-template>
  </ng-template>
</ng-container>
```

# Displaying Global Background Fetching Loading State

In addition to individual query loading states, if you would like to show a global loading indicator when **any** queries are fetching (including in the background), you can use the `useIsFetching` hook:

```ts
// app.component.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isFetching$: Observable<boolean>;

  constructor(private azahi: Azahi) {}

  ngOnInit(): void {
    this.isFetching$ = this.azahi.useIsFetching();
  }
}
```

```html
// app.component.html
<div *ngIf="todos.isFetching">Refreshing...</div>
```
