---
id: overview
title: Overview
---

Azahi is often described as the missing data-fetching library for Angular, but in more technical terms, it makes **fetching, caching, synchronizing and updating server state** in your Angular applications a breeze.

## Motivation

While most traditional state management libraries are great for working with client state, they are **not so great at working with async or server state**. This is because **server state is totally different**. For starters, server state:

- Is persisted remotely in a location you do not control or own
- Requires asynchronous APIs for fetching and updating
- Implies shared ownership and can be changed by other people without your knowledge
- Can potentially become "out of date" in your applications if you're not careful

Once you grasp the nature of server state in your application, **even more challenges will arise** as you go, for example:

- Caching... (possibly the hardest thing to do in programming)
- Deduping multiple requests for the same data into a single request
- Updating out of date data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading data
- Managing memory and garbage collection of server state
- Memoizing query results with structural sharing

If you're not overwhelmed by that list, then that must mean that you've probably solved all of your server state problems already and deserve an award. However, if you are like a vast majority of people, you either have yet to tackle all or most of these challenges and we're only scratching the surface!

Azahi is hands down one of the _best_ libraries for managing server state. It works amazingly well **out-of-the-box, with zero-config, and can be customized** to your liking as your application grows.

Azahi allows you to defeat and overcome the tricky challenges and hurdles of _server state_ and control your app data before it starts to control you.

On a more technical note, Azahi will likely:

- Help you remove **many** lines of complicated and misunderstood code from your application and replace with just a handful of lines of Azahi logic.
- Make your application more maintainable and easier to build new features without worrying about wiring up new server state data sources
- Have a direct impact on your end-users by making your application feel faster and more responsive than ever before.
- Potentially help you save on bandwidth and increase memory performance

## Enough talk, show me some code already!

In the example below, you can see Azahi in its most basic and simple form being used to fetch the GitHub stats for the Azahi GitHub project itself:

[Open in CodeSandbox](https://codesandbox.io/s/github/anymaniax/azahi/tree/main/examples/simple)

```ts
// app.module.ts
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularQueryModule, QueryClient } from 'azahi';
import { AppComponent } from './app.component';

const queryClient = new QueryClient();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularQueryModule.forRoot(queryClient),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```ts
// app.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Azahi, UseQueryObservable } from 'azahi';

interface RepoInformation {
  name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public repoData$: UseQueryObservable<RepoInformation>;

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    this.repoData$ = this.azahi.useQuery('repoData', () =>
      this.http.get<RepoInformation>(
        'https://api.github.com/repos/anymaniax/azahi'
      )
    );
  }
}
```

## You talked me into it, so what now?

- Learn Azahi at your own pace with our amazingly thorough [Walkthough Guide](../installation) and [API Reference](../reference/useQuery)
