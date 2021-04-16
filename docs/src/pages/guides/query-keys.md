---
id: query-keys
title: Query Keys
---

At its core, Azahi manages query caching for you based on query keys. Query keys can be as simple as a string, or as complex as an array of many strings and nested objects. As long as the query key is serializable, and **unique to the query's data**, you can use it!

### String-Only Query Keys

The simplest form of a key is actually not an array, but an individual string. When a string query key is passed, it is converted to an array internally with the string as the only item in the query key. This format is useful for:

- Generic List/Index resources
- Non-hierarchical resources

```js
// A list of todos
this.azahi.useQuery('todos', ...) // queryKey === ['todos']

// Something else, whatever!
this.azahi.useQuery('somethingSpecial', ...) // queryKey === ['somethingSpecial']
```

### Array Keys

When a query needs more information to uniquely describe its data, you can use an array with a string and any number of serializable objects to describe it. This is useful for:

- Hierarchical or nested resources
  - It's common to pass an ID, index, or other primitive to uniquely identify the item
- Queries with additional parameters
  - It's common to pass an object of additional options

```js
// An individual todo
this.azahi.useQuery(['todo', 5], ...)
// queryKey === ['todo', 5]

// And individual todo in a "preview" format
this.azahi.useQuery(['todo', 5, { preview: true }], ...)
// queryKey === ['todo', 5, { preview: true }]

// A list of todos that are "done"
this.azahi.useQuery(['todos', { type: 'done' }], ...)
// queryKey === ['todos', { type: 'done' }]
```

### Query Keys are hashed deterministically!

This means that no matter the order of keys in objects, all of the following queries are considered equal:

```js
this.azahi.useQuery(['todos', { status, page }], ...)
this.azahi.useQuery(['todos', { page, status }], ...)
this.azahi.useQuery(['todos', { page, status, other: undefined }], ...)
```

The following query keys, however, are not equal. Array item order matters!

```js
this.azahi.useQuery(['todos', status, page], ...)
this.azahi.useQuery(['todos', page, status], ...)
this.azahi.useQuery(['todos', undefined, page, status], ...)
```

## If your query function depends on a variable, include it in your query key

Since query keys uniquely describe the data they are fetching, they should include any variables you use in your query function that **change**. For example:

```js
const queryResult = this.azahi.useQuery(['todos', todoId], () =>
  fetchTodoById(todoId)
);
```
