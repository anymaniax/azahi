import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Azahi, UseQueryObservable } from 'azahi';
import { Post } from '../app.types';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  postsQuery$: UseQueryObservable<{ posts: Post[] }>;

  @Input()
  setPostId: (id: number) => void;

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    this.postsQuery$ = this.azahi.useQuery('posts', () =>
      this.http.get(`/api/posts`)
    );
  }

  isCached(postId: number) {
    return this.azahi.queryClient.getQueryData(['posts', postId])
      ? {
          'font-weight': 'bold',
          color: 'green',
        }
      : {};
  }
}
