import { from, Observable } from 'rxjs';
import {
  DefaultOptions,
  FetchInfiniteQueryOptions,
  InfiniteData,
  InvalidateOptions,
  InvalidateQueryFilters,
  MutationCache,
  MutationKey,
  MutationObserverOptions,
  MutationOptions,
  QueryCache,
  QueryClient as CoreQueryClient,
  QueryKey,
  QueryObserverOptions,
  QueryOptions,
  RefetchOptions,
  ResetOptions,
} from './query-core';
import { QueryState, SetDataOptions } from './query-core/core/query';
import { QueryClientConfig } from './query-core/core/queryClient';
import { CancelOptions } from './query-core/core/retryer';
import {
  MutationFilters,
  QueryFilters,
  Updater,
} from './query-core/core/utils';
import {
  FetchInfiniteQueryOptionsWithObservable,
  FetchQueryOptionsWithObservable,
  MutationObserverOptionsWithObservable,
  MutationOptionsWithObservable,
  QueryFunctionWithObservable,
  QueryObserverOptionsWithObervable,
} from './types';
import { parseMutationArgs, parseQueryArgs } from './utils';

export class QueryClient {
  core: CoreQueryClient;
  constructor(config?: QueryClientConfig) {
    this.core = new CoreQueryClient(config);
  }

  mount(): void {
    return this.core.mount();
  }

  unmount(): void {
    return this.core.unmount();
  }

  isFetching(filters?: QueryFilters): number;
  isFetching(queryKey?: QueryKey, filters?: QueryFilters): number;
  isFetching(arg1?: QueryKey | QueryFilters, arg2?: QueryFilters): number {
    return this.core.isFetching(arg1 as any, arg2 as any);
  }

  isMutating(filters?: MutationFilters): number {
    return this.core.isMutating(filters);
  }

  getQueryData<TData = unknown>(
    queryKey: QueryKey,
    filters?: QueryFilters
  ): TData | undefined {
    return this.core.getQueryData<TData>(queryKey, filters);
  }

  setQueryData<TData>(
    queryKey: QueryKey,
    updater: Updater<TData | undefined, TData>,
    options?: SetDataOptions
  ): TData {
    return this.core.setQueryData<TData>(queryKey, updater, options);
  }

  getQueryState<TData = unknown, TError = undefined>(
    queryKey: QueryKey,
    filters?: QueryFilters
  ): QueryState<TData, TError> | undefined {
    return this.core.getQueryState<TData, TError>(queryKey, filters);
  }

  removeQueries(filters?: QueryFilters): void;
  removeQueries(queryKey?: QueryKey, filters?: QueryFilters): void;
  removeQueries(arg1?: QueryKey | QueryFilters, arg2?: QueryFilters): void {
    return this.core.removeQueries(arg1 as any, arg2 as any);
  }

  resetQueries(
    filters?: QueryFilters,
    options?: ResetOptions
  ): Observable<void>;
  resetQueries(
    queryKey?: QueryKey,
    filters?: QueryFilters,
    options?: ResetOptions
  ): Observable<void>;
  resetQueries(
    arg1?: QueryKey | QueryFilters,
    arg2?: QueryFilters | ResetOptions,
    arg3?: ResetOptions
  ): Observable<void> {
    return from(this.core.resetQueries(arg1 as any, arg2 as any, arg3 as any));
  }

  cancelQueries(
    filters?: QueryFilters,
    options?: CancelOptions
  ): Observable<void>;
  cancelQueries(
    queryKey?: QueryKey,
    filters?: QueryFilters,
    options?: CancelOptions
  ): Observable<void>;
  cancelQueries(
    arg1?: QueryKey | QueryFilters,
    arg2?: QueryFilters | CancelOptions,
    arg3?: CancelOptions
  ): Observable<void> {
    return from(this.core.cancelQueries(arg1 as any, arg2 as any, arg3 as any));
  }

  invalidateQueries(
    filters?: InvalidateQueryFilters,
    options?: InvalidateOptions
  ): Observable<void>;
  invalidateQueries(
    queryKey?: QueryKey,
    filters?: InvalidateQueryFilters,
    options?: InvalidateOptions
  ): Observable<void>;
  invalidateQueries(
    arg1?: QueryKey | InvalidateQueryFilters,
    arg2?: InvalidateQueryFilters | InvalidateOptions,
    arg3?: InvalidateOptions
  ): Observable<void> {
    return from(
      this.core.invalidateQueries(arg1 as any, arg2 as any, arg3 as any)
    );
  }

  refetchQueries(
    filters?: QueryFilters,
    options?: RefetchOptions
  ): Observable<void>;
  refetchQueries(
    queryKey?: QueryKey,
    filters?: QueryFilters,
    options?: RefetchOptions
  ): Observable<void>;
  refetchQueries(
    arg1?: QueryKey | QueryFilters,
    arg2?: QueryFilters | RefetchOptions,
    arg3?: RefetchOptions
  ): Observable<void> {
    return from(
      this.core.refetchQueries(arg1 as any, arg2 as any, arg3 as any)
    );
  }

  fetchQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    options: FetchQueryOptionsWithObservable<TQueryFnData, TError, TData>
  ): Observable<TData>;
  fetchQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    options?: FetchQueryOptionsWithObservable<TQueryFnData, TError, TData>
  ): Observable<TData>;
  fetchQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable<TQueryFnData>,
    options?: FetchQueryOptionsWithObservable<TQueryFnData, TError, TData>
  ): Observable<TData>;
  fetchQuery<TQueryFnData, TError, TData = TQueryFnData>(
    arg1:
      | QueryKey
      | FetchQueryOptionsWithObservable<TQueryFnData, TError, TData>,
    arg2?:
      | QueryFunctionWithObservable<TQueryFnData>
      | FetchQueryOptionsWithObservable<TQueryFnData, TError, TData>,
    arg3?: FetchQueryOptionsWithObservable<TQueryFnData, TError, TData>
  ): Observable<TData> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

    return from(this.core.fetchQuery(parsedOptions));
  }

  prefetchQuery(options: FetchQueryOptionsWithObservable): Observable<void>;
  prefetchQuery(
    queryKey: QueryKey,
    options?: FetchQueryOptionsWithObservable
  ): Observable<void>;
  prefetchQuery(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable,
    options?: FetchQueryOptionsWithObservable
  ): Observable<void>;
  prefetchQuery(
    arg1: QueryKey | FetchQueryOptionsWithObservable,
    arg2?: QueryFunctionWithObservable | FetchQueryOptionsWithObservable,
    arg3?: FetchQueryOptionsWithObservable
  ): Observable<void> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

    return from(this.core.prefetchQuery(parsedOptions));
  }

  fetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData
  >(
    options: FetchInfiniteQueryOptionsWithObservable<
      TQueryFnData,
      TError,
      TData
    >
  ): Observable<InfiniteData<TData>>;
  fetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData
  >(
    queryKey: QueryKey,
    options?: FetchInfiniteQueryOptionsWithObservable<
      TQueryFnData,
      TError,
      TData
    >
  ): Observable<InfiniteData<TData>>;
  fetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData
  >(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable<TQueryFnData>,
    options?: FetchInfiniteQueryOptionsWithObservable<
      TQueryFnData,
      TError,
      TData
    >
  ): Observable<InfiniteData<TData>>;
  fetchInfiniteQuery<TQueryFnData, TError, TData = TQueryFnData>(
    arg1:
      | QueryKey
      | FetchInfiniteQueryOptionsWithObservable<TQueryFnData, TError, TData>,
    arg2?:
      | QueryFunctionWithObservable<TQueryFnData>
      | FetchInfiniteQueryOptionsWithObservable<TQueryFnData, TError, TData>,
    arg3?: FetchInfiniteQueryOptionsWithObservable<TQueryFnData, TError, TData>
  ): Observable<InfiniteData<TData>> {
    const parsedOptions = parseQueryArgs<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData>
    >(arg1 as any, arg2 as any, arg3 as any);

    return from(
      this.core.fetchInfiniteQuery<TQueryFnData, TError, TData>(parsedOptions)
    );
  }

  prefetchInfiniteQuery(
    options: FetchInfiniteQueryOptionsWithObservable
  ): Observable<void>;
  prefetchInfiniteQuery(
    queryKey: QueryKey,
    options?: FetchInfiniteQueryOptionsWithObservable
  ): Observable<void>;
  prefetchInfiniteQuery(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable,
    options?: FetchInfiniteQueryOptionsWithObservable
  ): Observable<void>;
  prefetchInfiniteQuery(
    arg1: QueryKey | FetchInfiniteQueryOptionsWithObservable,
    arg2?:
      | QueryFunctionWithObservable
      | FetchInfiniteQueryOptionsWithObservable,
    arg3?: FetchInfiniteQueryOptionsWithObservable
  ): Observable<void> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

    return from(this.core.prefetchInfiniteQuery(parsedOptions));
  }

  cancelMutations(): Observable<void> {
    return from(this.core.cancelMutations());
  }

  resumePausedMutations(): Observable<void> {
    return from(this.core.resumePausedMutations());
  }

  executeMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
  >(
    options: MutationOptionsWithObservable<TData, TError, TVariables, TContext>
  ): Observable<TData> {
    const parsedOptions = parseMutationArgs(options);
    return from(
      this.core.executeMutation<TData, TError, TVariables, TContext>(
        parsedOptions
      )
    );
  }

  getQueryCache(): QueryCache {
    return this.core.getQueryCache();
  }

  getMutationCache(): MutationCache {
    return this.core.getMutationCache();
  }

  getDefaultOptions(): DefaultOptions {
    return this.core.getDefaultOptions();
  }

  setDefaultOptions(options: DefaultOptions): void {
    return this.core.setDefaultOptions(options);
  }

  setQueryDefaults(
    queryKey: QueryKey,
    options: QueryObserverOptionsWithObervable<any, any, any, any>
  ): void {
    const parsedOptions = parseQueryArgs(options);
    return this.core.setQueryDefaults(queryKey, parsedOptions);
  }

  getQueryDefaults(
    queryKey?: QueryKey
  ): QueryObserverOptions<any, any, any, any> | undefined {
    return this.core.getQueryDefaults(queryKey);
  }

  setMutationDefaults(
    mutationKey: MutationKey,
    options: MutationObserverOptionsWithObservable<any, any, any, any>
  ): void {
    const parsedOptions = parseMutationArgs(options);
    return this.core.setMutationDefaults(mutationKey, parsedOptions);
  }

  getMutationDefaults(
    mutationKey?: MutationKey
  ): MutationObserverOptions<any, any, any, any> | undefined {
    return this.core.getMutationDefaults(mutationKey);
  }

  defaultQueryOptions<T extends QueryOptions<any, any, any>>(options?: T): T {
    return this.core.defaultQueryOptions<T>(options);
  }

  defaultQueryObserverOptions<
    T extends QueryObserverOptions<any, any, any, any>
  >(options?: T): T {
    return this.core.defaultQueryObserverOptions<T>(options);
  }

  defaultMutationOptions<T extends MutationOptions<any, any, any, any>>(
    options?: T
  ): T {
    return this.core.defaultMutationOptions<T>(options);
  }

  clear(): void {
    return this.core.clear();
  }
}
