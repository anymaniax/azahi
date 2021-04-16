import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Azahi, UseQueryResult } from 'azahi';
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
  public repoDataQuery$: Observable<UseQueryResult<RepoInformation>>;

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    this.repoDataQuery$ = this.azahi.useQuery('repoData', () =>
      this.http.get<RepoInformation>(
        'https://api.github.com/repos/anymaniax/angular-query'
      )
    );
  }
}
