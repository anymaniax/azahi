import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AngularQueryService {
  private queries: Map<string, BehaviorSubject<{ isLoading; error; data }>> = new Map();

  constructor() {}

  public useQuery(queryKey: string, queryFn: () => Promise<any>): Observable<any> {
    let subject: BehaviorSubject<any> = this.queries.get(queryKey);
    if (!subject) {
      subject = new BehaviorSubject<any>({ isLoading: true });
      this.queries.set(queryKey, subject);
    }

    queryFn().then(
      (response) => {
        subject.next({ isLoading: false, data: response });
      },
      (error) => {
        subject.next({ isLoading: false, error });
      }
    );

    return subject.pipe(
      map((value) => {
        if (null === value) {
          return { isLoading: true };
        }

        return value;
      })
    );
  }
}
