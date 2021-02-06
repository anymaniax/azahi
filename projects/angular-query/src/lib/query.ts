import { AngularQueryClient } from './angular-query-client';
import { notifyManager, QueryKey, QueryObserver } from './query-core';
import { parseQueryArgs } from './query-core/core/utils';
import { QueryBehaviorSubject } from './query.utils';
import {
  QueryFunctionWithObservable,
  UseQueryObservable,
  UseQueryOptions,
} from './types';
import { getOptionsWithQueryFnDataPromise, setBatchCalls } from './utils';

export class Query {
  constructor(private queryClient: AngularQueryClient) {}

  public use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    options: UseQueryOptions<TQueryFnData, TError, TData>
  ): UseQueryObservable<TData, TError>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
  ): UseQueryObservable<TData, TError>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable<TQueryFnData>,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
  ): UseQueryObservable<TData, TError>;
  use<TQueryFnData, TError, TData = TQueryFnData>(
    arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
      | QueryFunctionWithObservable<TQueryFnData>
      | UseQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseQueryOptions<TQueryFnData, TError, TData>
  ): UseQueryObservable<TData, TError> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

    const optionsQueryFnDataPromise = getOptionsWithQueryFnDataPromise(
      parsedOptions
    );

    let defaultedOptions = this.queryClient.defaultQueryObserverOptions(
      optionsQueryFnDataPromise
    );

    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls(defaultedOptions);

    const observer = new QueryObserver<any, any, any, any>(
      this.queryClient,
      defaultedOptions
    );

    if (observer.hasListeners()) {
      observer.setOptions(defaultedOptions);
    }

    const currentResult = observer.getCurrentResult();

    const subject = new QueryBehaviorSubject<TData, TError>(currentResult);

    observer.subscribe(
      notifyManager.batchCalls((result) => subject.next(result))
    );

    return subject.asObservableWithQuery();
  }
}
