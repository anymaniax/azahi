---
id: paginated-queries
title: Paginated / Lagged Queries
---

Rendering paginated data is a very common UI pattern and in Azahi, it "just works" by including the page information in the query key:

```js
this.azahi.useQuery(['projects', page], fetchProjects);
```

However, if you run this simple example, you might notice something strange:

**The UI jumps in and out of the `success` and `loading` states because each new page is treated like a brand new query.**

This experience is not optimal and unfortunately is how many tools today insist on working. But not Azahi! As you may have guessed, Azahi comes with an awesome featured called `keepPreviousData` that allows us to get around this.

## Better Paginated Queries with `keepPreviousData`

Consider the following example where we would ideally want to increment a pageIndex (or cursor) for a query. If we were to use `useQuery`, **it would still technically work fine**, but the UI would jump in and out of the `success` and `loading` states as different queries are created and destroyed for each page or cursor. By setting `keepPreviousData` to `true` we get a few new things:

- **The data from the last successful fetch available while new data is being requested, even though the query key has changed**.
- When the new data arrives, the previous `data` is seamlessly swapped to show the new data.
- `isPreviousData` is made available to know what data the query is currently providing you

```ts
// app.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Azahi, UseInfiniteQueryObservable } from 'azahi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public page = 0;
  public projectsQuery$: UseQueryObservable;

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    const fetchProjects = (page = 0) =>
      this.http.get('/api/projects?page=' + page);

    this.projectsQuery$ = this.azahi.useQuery(
      ['projects', this.page],
      fetchProjects,
      {
        keepPreviousData: true,
      }
    );
  }

  next(query: UseInfiniteQueryObservable) {
    if (!query.isPreviousData && query.data.hasMore) {
      page = page + 1;
    }
  }

  previous() {
    page = Math.max(page - 1, 0);
  }
}
```

```html
// app.component.html
<ng-container *ngIf="projectsQuery$ | async as query">
  <ng-container *ngIf="query.status === 'loading'; else loaded">
    <p>Loading...</p>
  </ng-container>

  <ng-template #loaded>
    <ng-container *ngIf="query.status === 'error'; else valid">
      An error has occurred: {{ query.error['message'] }}
    </ng-container>
    <ng-template #valid>
      <div *ngFor="let project of query.data.projects">
        <p>{{ project.name }}</p>
      </div>
    </ng-template>
  </ng-template>
      <span>Current Page: {{page + 1}}</span>
    <button
      (click)="previous()"
      [disabled]="page === 0">
      Previous Page
    </button>
    <button
      (click)="next()"
      //Disable the Next Page button until we know a next page is available
      [disabled]="query.isPreviousData || !query.data.hasMore">
      Next Page
    </button>
</ng-container>
```

## Lagging Infinite Query results with `keepPreviousData`

While not as common, the `keepPreviousData` option also works flawlessly with the `useInfiniteQuery` hook, so you can seamlessly allow your users to continue to see cached data while infinite query keys change over time.
