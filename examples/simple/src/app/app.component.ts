import { AngularQueryService } from 'angular-query';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'simple';

  private subscription: Subscription;

  constructor(private angularQueryService: AngularQueryService) {}

  ngOnInit(): void {
    this.subscription = this.angularQueryService.useQuery().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
