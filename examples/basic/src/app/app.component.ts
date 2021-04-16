import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  postId = -1;
  constructor() {
    this.setPostId = this.setPostId.bind(this);
  }

  setPostId(postId: number) {
    this.postId = postId;
  }
}
