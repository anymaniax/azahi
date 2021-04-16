import { QueryClient } from './query-client';
import { notifyManager, QueryObserver } from './query-core';
import { UseBaseQueryOptions, UseQueryResult } from './types';
import { QueryObservable, setBatchCalls } from './utils';

export class BaseQuery {
  constructor(private queryClient: QueryClient) {}

  public use<TQueryFnData, TError, TData, TQueryData>(
    options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData>,
    Observer: typeof QueryObserver,
    Observable: typeof QueryObservable
  ) {
    let defaultedOptions = this.queryClient.defaultQueryObserverOptions(
      options
    );

    // Make sure results are optimistically set in fetching state before subscribing or updating options
    defaultedOptions.optimisticResults = true;

    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls(defaultedOptions);

    const observer = new Observer<any, any>(
      this.queryClient.core,
      defaultedOptions
    );

    const queryObservable = new Observable<UseQueryResult<TData, TError>>(
      observer.getOptimisticResult(defaultedOptions),
      (obs) => {
        const firstResult = observer.getOptimisticResult(defaultedOptions);

        // Handle result property usage tracking
        obs.next(
          defaultedOptions.notifyOnChangeProps === 'tracked'
            ? observer.trackResult(firstResult)
            : firstResult
        );

        const unsubscribe = observer.subscribe(
          notifyManager.batchCalls(() => {
            const result = observer.getOptimisticResult(defaultedOptions);

            obs.next(
              defaultedOptions.notifyOnChangeProps === 'tracked'
                ? observer.trackResult(result)
                : result
            );
          })
        );

        // Update result to make sure we did not miss any query updates
        // between creating the observer and subscribing to it.
        observer.updateResult();

        return unsubscribe;
      }
    );

    return queryObservable;
  }
}
