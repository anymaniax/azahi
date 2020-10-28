import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { QueryObserverResult, UseQueryService } from 'angular-query';
import { Observable } from 'rxjs';

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
  public repoData$: Observable<QueryObserverResult<RepoInformation>>;

  constructor(private angularQueryService: UseQueryService, private http: HttpClient) {}

  ngOnInit(): void {
    this.repoData$ = this.angularQueryService.useQuery('repoData', () =>
      this.http.get<RepoInformation>('https://api.github.com/repos/tannerlinsley/react-query').toPromise()
    );
  }
}
