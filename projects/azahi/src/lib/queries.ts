import { Observable } from 'rxjs';
import { QueryClient } from './query-client';
import { notifyManager, QueriesObserver } from './query-core';
import { UseQueryOptions, UseQueryResult } from './types';
import { getQueriesOptionsWithQueryFnDataPromise } from './utils';

export class Queries {
  constructor(private queryClient: QueryClient) {}

  use(queries: UseQueryOptions[]): Observable<UseQueryResult[]> {
    const queriesOptionsWithQueryFnDataPromise = getQueriesOptionsWithQueryFnDataPromise(
      queries
    );

    // Create queries observer
    const observer = new QueriesObserver(
      this.queryClient.core,
      queriesOptionsWithQueryFnDataPromise
    );

    // Update queries
    if (observer.hasListeners()) {
      observer.setQueries(queries);
    }

    const queriesObservable = new Observable<UseQueryResult[]>((obs) =>
      observer.subscribe(
        notifyManager.batchCalls((result) =>
          obs.next(result as UseQueryResult[])
        )
      )
    );

    return queriesObservable;
  }
}
