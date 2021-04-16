import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Azahi, UseQueryResult } from 'azahi';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';

interface GetProjects {
  projects: { name: string }[];
  hasMore: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public projects$: Observable<UseQueryResult<GetProjects>>;
  page = 0;

  pageChange$ = new Subject<number>();

  constructor(private azahi: Azahi, private http: HttpClient) {}

  ngOnInit(): void {
    const fetchProjects = (page = 0) =>
      this.http.get<GetProjects>('/api/projects?page=' + page);

    this.projects$ = this.pageChange$.pipe(
      startWith(0),
      tap((page) => (this.page = page)),
      switchMap((page) =>
        this.azahi
          .useQuery(['projects', page], () => fetchProjects(page))
          .pipe(
            tap(() => {
              this.azahi.queryClient.prefetchQuery(['projects', page + 1], () =>
                fetchProjects(page + 1)
              );
            })
          )
      )
    );
  }
}
