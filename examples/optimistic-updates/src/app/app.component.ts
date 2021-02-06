import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AngularQuery,
  AngularQueryClient,
  UseMutationObservable,
  UseQueryObservable,
} from 'angular-query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  text = '';
  public todos$: UseQueryObservable<{ items: string[] }>;
  public addTodoMutation$: UseMutationObservable;

  constructor(
    private query: AngularQuery,
    private queryClient: AngularQueryClient,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.todos$ = this.query.useQuery('todos', () =>
      this.http.get('/api/data')
    );

    this.addTodoMutation$ = this.query.useMutation(
      (text: string) => this.http.post('/api/data', text),
      {
        // Optimistically update the cache value on mutate, but store
        // the old value and return it so that it's accessible in case of
        // an error
        onMutate: async (text) => {
          this.text = '';
          await this.queryClient.cancelQueries('todos');

          const previousValue = this.queryClient.getQueryData('todos');

          this.queryClient.setQueryData(
            'todos',
            (old: { items: string[] }) => ({
              ...old,
              items: [...old.items, text],
            })
          );

          return previousValue;
        },
        // On failure, roll back to the previous value
        onError: (err, variables, previousValue) => {
          this.queryClient.setQueryData('todos', previousValue);
        },
        // After success or failure, refetch the todos query
        onSuccess: () => {
          this.queryClient.invalidateQueries('todos');
        },
      }
    );
  }

  onSubmit(e) {
    e.preventDefault();
    this.addTodoMutation$.mutate(this.text);
  }
}
