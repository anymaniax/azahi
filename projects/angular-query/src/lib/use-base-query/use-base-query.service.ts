import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QUERY_CLIENT } from '../angular-query.token';
import { QueryClient, QueryObserver, QueryObserverResult } from '../query/core';
import { UseBaseQueryOptions, UseQueryResult } from '../types';

@Injectable({
  providedIn: 'root',
})
export class UseBaseQueryService {
  constructor(@Inject(QUERY_CLIENT) private queryClient: QueryClient) {
    this.useBaseQuery = this.useBaseQuery.bind(this);
  }

  public useBaseQuery<TData, TError, TQueryFnData, TQueryData>(
    options: UseBaseQueryOptions<TData, TError, TQueryFnData, TQueryData>
  ): Observable<UseQueryResult<TData, TError>> {
    const defaultedOptions = this.queryClient.defaultQueryObserverOptions(options);
    const observer = new QueryObserver<any, any, any, any>(this.queryClient, defaultedOptions);

    if (observer.hasListeners()) {
      observer.setOptions(defaultedOptions);
    }

    const currentResult = observer.getCurrentResult();

    const subject: BehaviorSubject<QueryObserverResult<TData, TError>> = new BehaviorSubject<
      QueryObserverResult<TData, TError>
    >(currentResult);

    observer.subscribe((result) => subject.next(result));

    return subject.asObservable();
  }
}
