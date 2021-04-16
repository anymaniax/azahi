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
        // Optimistically update the cache value on mutate, but store
        // the old value and return it so that it's accessible in case of
        // an error
        onMutate: (text) => {
          this.text = '';
          this.azahi.queryClient.cancelQueries('todos');

          const previousValue = this.azahi.queryClient.getQueryData('todos');

          this.azahi.queryClient.setQueryData(
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
          this.azahi.queryClient.setQueryData('todos', previousValue);
        },
        // After success or failure, refetch the todos query
        onSuccess: () => {
          this.azahi.queryClient.invalidateQueries('todos');
        },
      }
    );
  }

  onSubmit(e) {
    e.preventDefault();
    this.addTodoMutation$.mutate(this.text);
  }
}
