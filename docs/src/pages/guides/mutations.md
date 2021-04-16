---
id: mutations
title: Mutations
---

Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, Azahi exports a `useMutation` hook.

Here's an example of a mutation that adds a new todo to the server:

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public addTodoMutation$: UseMutationObservable;

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    this.addTodoMutation$ = this.azahi.useMutation((text: string) =>
      this.http.post('/api/data', text)
    );
  }

  onSubmit(e) {
    e.preventDefault();
    this.addTodoMutation$.mutate(this.text);
  }
}
```

A mutation can only be in one of the following states at any given moment:

- `isIdle` or `status === 'idle' - The mutation is currently idle or in a fresh/reset state
- `isLoading` or `status === 'loading' -` The mutation is currently running
- `isError` or `status === 'error'` - The mutation encountered an error
- `isSuccess` or `status === 'success'` - The mutation was successful and mutation data is available

Beyond those primary state, more information is available depending on the state the mutation:

- `error` - If the mutation is in an `isError` state, the error is available via the `error` property.
- `data` - If the mutation is in a `success` state, the data is available via the `data` property.

In the example above, you also saw that you can pass variables to your mutations function by calling the `mutate` function with a **single variable or object**.

Even with just variables, mutations aren't all that special, but when used with the `onSuccess` option, the [Query Client's `invalidateQueries` method](../reference/QueryClient#queryclientinvalidatequeries) and the [Query Client's `setQueryData` method](../reference/QueryClient#queryclientsetquerydata), mutations become a very powerful tool.

## Resetting Mutation State

It's sometimes the case that you need to clear the `error` or `data` of a mutation request. To do this, you can use the `reset` function to handle this:

```js
const mutation = this.azahi.useMutation(createTodo);

mutation.reset();
```

## Mutation Side Effects

`useMutation` comes with some helper options that allow quick and easy side-effects at any stage during the mutation lifecycle. These come in handy for both [invalidating and refetching queries after mutations](../invalidations-from-mutations) and even [optimistic updates](../optimistic-updates)

```js
this.azahi.useMutation(addTodo, {
  onMutate: (variables) => {
    // A mutation is about to happen!

    // Optionally return a context containing data to use when for example rolling back
    return { id: 1 };
  },
  onError: (error, variables, context) => {
    // An error happened!
    console.log(`rolling back optimistic update with id ${context.id}`);
  },
  onSuccess: (data, variables, context) => {
    // Boom baby!
  },
  onSettled: (data, error, variables, context) => {
    // Error or success... doesn't matter!
  },
});
```

When returning a promise in any of the callback functions it will first be awaited before the next callback is called:

```js
this.azahi.useMutation(addTodo, {
  onSuccess: async () => {
    console.log("I'm first!");
  },
  onSettled: async () => {
    console.log("I'm second!");
  },
});
```

You might find that you want to **trigger additional callbacks** then the ones defined on `useMutation` when calling `mutate`. This can be used to trigger component specific side effects. To do that, you can provide any of the same callback options to the `mutate` function after your mutation variable. Supported overrides include: `onSuccess`, `onError` and `onSettled`.

```js
this.azahi.useMutation(addTodo, {
  onSuccess: (data, variables, context) => {
    // I will fire first
  },
  onError: (error, variables, context) => {
    // I will fire first
  },
  onSettled: (data, error, variables, context) => {
    // I will fire first
  },
});

mutate(todo, {
  onSuccess: (data, variables, context) => {
    // I will fire second!
  },
  onError: (error, variables, context) => {
    // I will fire second!
  },
  onSettled: (data, error, variables, context) => {
    // I will fire second!
  },
});
```

## Promises

Use `mutateAsync` instead of `mutate` to get a promise which will resolve on success or throw on an error. This can for example be used to compose side effects.

```js
const mutation = this.azahi.useMutation(addTodo);
const mutate = await this.azahi.mutateAsync(todo);
```

## Retry

By default Azahi will not retry a mutation on error, but it is possible with the `retry` option:

```js
const mutation = this.azahi.useMutation(addTodo, {
  retry: 3,
});
```

If mutations fail because the device is offline, they will be retried in the same order when the device reconnects.

## Persist mutations

Mutations can be persisted to storage if needed and resumed at a later point. This can be done with the hydration functions:

```js
// Define the "addTodo" mutation
queryClient.setMutationDefaults('addTodo', {
  mutationFn: addTodo,
  onMutate: async (variables) => {
    // Cancel current queries for the todos list
    await queryClient.cancelQueries('todos');

    // Create optimistic todo
    const optimisticTodo = { id: uuid(), title: variables.title };

    // Add optimistic todo to todos list
    queryClient.setQueryData('todos', (old) => [...old, optimisticTodo]);

    // Return context with the optimistic todo
    return { optimisticTodo };
  },
  onSuccess: (result, variables, context) => {
    // Replace optimistic todo in the todos list with the result
    queryClient.setQueryData('todos', (old) =>
      old.map((todo) => (todo.id === context.optimisticTodo.id ? result : todo))
    );
  },
  onError: (error, variables, context) => {
    // Remove optimistic todo from the todos list
    queryClient.setQueryData('todos', (old) =>
      old.filter((todo) => todo.id !== context.optimisticTodo.id)
    );
  },
  retry: 3,
});

// Start mutation in some component:
const mutation = this.azahi.useMutation('addTodo');
mutation.mutate({ title: 'title' });

// If the mutation has been paused because the device is for example offline,
// Then the paused mutation can be dehydrated when the application quits:
const state = dehydrate(queryClient);

// The mutation can then be hydrated again when the application is started:
hydrate(queryClient, state);

// Resume the paused mutations:
queryClient.resumePausedMutations();
```
