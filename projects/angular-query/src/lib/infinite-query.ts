import { AngularQueryClient } from './angular-query-client';
import {
  InfiniteQueryBehavierSubject,
  InfiniteQueryObservable,
} from './infinite-query.utils';
import {
  InfiniteQueryObserver,
  notifyManager,
  QueryFunction,
  QueryKey,
} from './query-core';
import { parseQueryArgs } from './query-core/core/utils';
import { UseInfiniteQueryOptions } from './types';
import { getOptionsWithQueryFnDataPromise, setBatchCalls } from './utils';

export class InfiniteQuery {
  constructor(private queryClient: AngularQueryClient) {}
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    options: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): InfiniteQueryObservable<TData, TError>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): InfiniteQueryObservable<TData, TError>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TQueryFnData>,
    options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): InfiniteQueryObservable<TData, TError>;
  use<TQueryFnData, TError, TData = TQueryFnData>(
    arg1: QueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
      | QueryFunction<TQueryFnData>
      | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): InfiniteQueryObservable<TData, TError> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

    const optionsQueryFnDataPromise = getOptionsWithQueryFnDataPromise(
      parsedOptions
    );

    let defaultedOptions = this.queryClient.defaultQueryObserverOptions(
      optionsQueryFnDataPromise
    );
    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls(defaultedOptions);

    const observer = new InfiniteQueryObserver<any, any, any>(
      this.queryClient,
      defaultedOptions
    );

    const currentResult = observer.getCurrentResult();

    const subject = new InfiniteQueryBehavierSubject<TData, TError>(
      currentResult
    );

    observer.subscribe(
      notifyManager.batchCalls((result) => subject.next(result))
    );

    return subject.asObservableWithInfinite();
  }
}
