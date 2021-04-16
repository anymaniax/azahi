---
id: default-query-function
title: Default Query Function
---

If you find yourself wishing for whatever reason that you could just share the same query function for your entire app and just use query keys to identify what it should fetch, you can do that by providing a **default query function** to Azahi:

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
// All you have to do now is pass a key!
const queryResult = this.azahi.useQuery('/posts');
// ...

// You can even leave out the queryFn and just go straight into options
const queryResult = this.azahi.useQuery(`/posts/${postId}`, {
  enabled: !!postId,
});
```

If you ever want to override the default queryFn, you can just provide your own like you normally would.
