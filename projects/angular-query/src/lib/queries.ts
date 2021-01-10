import { BehaviorSubject, Observable } from 'rxjs';
import { AngularQueryClient } from './angular-query-client';
import { notifyManager, QueriesObserver } from './query-core';
import { UseQueryOptions, UseQueryResult } from './types';
import { getQueriesOptionsWithQueryFnDataPromise } from './utils';

export class Queries {
  constructor(private queryClient: AngularQueryClient) {}

  use(queries: UseQueryOptions[]): Observable<UseQueryResult[]> {
    const queriesOptionsWithQueryFnDataPromise = getQueriesOptionsWithQueryFnDataPromise(
      queries
    );

    // Create queries observer
    const observer = new QueriesObserver(
      this.queryClient,
      queriesOptionsWithQueryFnDataPromise
    );

    // Update queries
    if (observer.hasListeners()) {
      observer.setQueries(queries);
    }

    const currentResult = observer.getCurrentResult();

    const subject = new BehaviorSubject(currentResult);

    observer.subscribe(
      notifyManager.batchCalls((result) => subject.next(result))
    );

    return subject.asObservable();
  }
}
