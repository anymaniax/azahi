import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Azahi, UseQueryObservable } from 'azahi';
import { Post } from '../app.types';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  postQuery$: UseQueryObservable<Post>;

  @Input()
  postId: number;
  @Input()
  setPostId: (id: number) => void;
  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    this.postQuery$ = this.azahi.useQuery(['posts', this.postId], () =>
      this.http.get(`/api/posts/${this.postId}`)
    );
  }
}
