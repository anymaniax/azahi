import { AngularQueryService } from 'angular-query';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public data: any = {};
  public error: any;
  public isLoading: boolean;

  private subscription: Subscription;

  constructor(private angularQueryService: AngularQueryService, private http: HttpClient) {}

  ngOnInit(): void {
    this.angularQueryService
      .useQuery('repoData', () =>
        this.http.get<any>('https://api.github.com/repos/tannerlinsley/react-query').toPromise()
      )
      .subscribe((response) => {
        const { data, error, isLoading } = response;
        this.data = data;
        this.error = error;
        this.isLoading = isLoading;
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
