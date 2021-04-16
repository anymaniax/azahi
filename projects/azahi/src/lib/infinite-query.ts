import { BaseQuery } from './base-query';
import { QueryClient } from './query-client';
import { InfiniteQueryObserver, QueryKey, QueryObserver } from './query-core';
import {
  QueryFunctionWithObservable,
  UseInfiniteQueryObservable,
  UseInfiniteQueryOptions,
} from './types';
import {
  InfiniteQueryObservable,
  parseQueryArgs,
  QueryObservable,
} from './utils';

export class InfiniteQuery {
  constructor(private queryClient: QueryClient) {}
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    options: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): UseInfiniteQueryObservable<TData, TError>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): UseInfiniteQueryObservable<TData, TError>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable<TQueryFnData>,
    options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): UseInfiniteQueryObservable<TData, TError>;
  use<TQueryFnData, TError, TData = TQueryFnData>(
    arg1: QueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
      | QueryFunctionWithObservable<TQueryFnData>
      | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
  ): UseInfiniteQueryObservable<TData, TError> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

    return new BaseQuery(this.queryClient).use(
      parsedOptions,
      InfiniteQueryObserver as typeof QueryObserver,
      InfiniteQueryObservable as typeof QueryObservable
    ) as UseInfiniteQueryObservable<TData, TError>;
  }
}
