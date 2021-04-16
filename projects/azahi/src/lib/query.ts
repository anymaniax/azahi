import { BaseQuery } from './base-query';
import { QueryClient } from './query-client';
import { QueryKey, QueryObserver } from './query-core';
import {
  QueryFunctionWithObservable,
  UseQueryObservable,
  UseQueryOptions,
} from './types';
import { parseQueryArgs, QueryObservable } from './utils';

export class Query {
  constructor(private queryClient: QueryClient) {}

  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
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

    return new BaseQuery(this.queryClient).use(
      parsedOptions,
      QueryObserver,
      QueryObservable
    );
  }
}
