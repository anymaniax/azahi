---
id: quick-start
title: Quick Start
---

This example very briefly illustrates the 3 core concepts of Azahi:

- Queries
- Mutations
- Query Invalidation

```ts
// app.module.ts
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AzahiModule, QueryClient } from 'azahi';
import { AppComponent } from './app.component';

const queryClient = new QueryClient();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AzahiModule.forRoot(queryClient)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```ts
// app.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Azahi, UseMutationObservable, UseQueryObservable } from 'azahi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  text = '';
  public todos$: UseQueryObservable<{ items: string[] }>;
  public addTodoMutation$: UseMutationObservable;

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    this.todos$ = this.azahi.useQuery('todos', () =>
      this.http.get('/api/data')
    );

    this.addTodoMutation$ = this.azahi.useMutation(
      (text: string) => this.http.post('/api/data', text),
      {
        onSuccess: () => {
          queryClient.invalidateQueries('todos');
        },
      }
    );
  }

  onSubmit(e) {
    e.preventDefault();
    this.addTodoMutation$.mutate(this.text);
  }
}
```

```html
// app.component.html
<form (submit)="onSubmit($event)">
  <input type="text" name="todo" [(ngModel)]="text" />
  <button>
    {{ (addTodoMutation$ | async).isLoading ? 'Creating...' : 'Create' }}
  </button>
</form>
<br />
<ng-container *ngIf="todos$ | async as todos">
  <ng-container
    *ngIf="todos.isLoading; then loading; else loaded"
  ></ng-container>
  <ng-template #loading>
    <p>Loading...</p>
  </ng-template>
  <ng-template #loaded>
    <ng-container *ngIf="todos.error; else valid">
      An error has occurred: {{ todos.error['message'] }}
    </ng-container>
    <ng-template #valid>
      <ul>
        <li *ngFor="let item of todos.data.items">{{ item }}</li>
      </ul>
      <div>{{ todos.isFetching ? 'Updating in background...' : ' ' }}</div>
    </ng-template>
  </ng-template>
</ng-container>
```

These three concepts make up most of the core functionality of Azahi. The next sections of the documentation will go over each of these core concepts in great detail.
