import { Observable } from 'rxjs';
import { QueryClient } from './query-client';
import { notifyManager, QueriesObserver } from './query-core';
import { UseQueryOptions, UseQueryResult } from './types';
import { parseQueryArgs, parseQueryResult } from './utils';

export class Queries {
  constructor(private queryClient: QueryClient) {}

  use(queries: UseQueryOptions[]): Observable<UseQueryResult[]> {
    const defaultedQueries = queries.map((options) => {
      const parsedOptions = parseQueryArgs(options);
      const defaultedOptions = this.queryClient.defaultQueryObserverOptions(
        parsedOptions
      );

      // Make sure the results are already in fetching state before subscribing or updating options
      defaultedOptions.optimisticResults = true;

      return defaultedOptions;
    });

    // Create queries observer
    const observer = new QueriesObserver(
      this.queryClient.core,
      defaultedQueries
    );

    // Update queries
    if (observer.hasListeners()) {
      observer.setQueries(queries);
    }

    const queriesObservable = new Observable<UseQueryResult[]>((obs) => {
      const firstResults = observer.getOptimisticResult(defaultedQueries);

      obs.next(firstResults.map((result) => parseQueryResult(result)));

      return observer.subscribe(
        notifyManager.batchCalls((results) =>
          obs.next(
            results.map((result) =>
              parseQueryResult(result)
            ) as UseQueryResult[]
          )
        )
      );
    });

    return queriesObservable;
  }
}
