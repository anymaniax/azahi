---
id: updates-from-mutation-responses
title: Updates from Mutation Responses
---

When dealing with mutations that **update** objects on the server, it's common for the new object to be automatically returned in the response of the mutation. Instead of refetching any queries for that item and wasting a network call for data we already have, we can take advantage of the object returned by the mutation function and update the existing query with the new data immediately using the [Query Client's `setQueryData`](../reference/QueryClient#queryclientsetquerydata) method:

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private azahi: Azahi) {}

  ngOnInit(): void {
    const editTodo$ = this.azahi.useMutation(editTodo, {
      onSuccess: (data) =>
        this.choufe.queryClient.setQueryData(['todo', { id: 5 }], data),
    });

    editTodo$.mutate({
      id: 5,
      name: 'Do the laundry',
    });

    // The query below will be updated with the response from the
    // successful mutation
    const queryResult = this.azahi.useQuery(['todo', { id: 5 }], fetchTodoByID);
  }
}
```
