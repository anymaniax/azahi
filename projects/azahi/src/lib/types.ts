import { Observable } from 'rxjs';
import { RetryDelayValue, RetryValue } from './query-core/core/retryer';
import {
  FetchInfiniteQueryOptions,
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  FetchQueryOptions,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  MutationKey,
  MutationStatus,
  QueryObserverOptions,
  QueryObserverResult,
  QueryOptions,
  RefetchOptions,
} from './query-core/core/types';
import {
  InfiniteQueryObservable,
  MutationObservable,
  QueryObservable,
} from './utils';

export type QueryFunctionWithObservable<T = unknown> = (
  ...args: any[]
) => T | Promise<T> | Observable<T>;

export type QueryOptionsWithObservable<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
> = Omit<QueryOptions<TQueryFnData, TError, TData>, 'queryFn'> & {
  queryFn?: QueryFunctionWithObservable<TQueryFnData>;
};

export type QueryObserverOptionsWithObervable<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
> = Omit<
  QueryObserverOptions<TData, TError, TQueryFnData, TQueryData>,
  'queryFn'
> & {
  queryFn?: QueryFunctionWithObservable<TQueryFnData>;
};

export type UseBaseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
> = QueryObserverOptionsWithObervable<TData, TError, TQueryFnData, TQueryData>;

export type UseQueryOptions<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData
> = UseBaseQueryOptions<TData, TError, TQueryFnData>;

export type UseInfiniteQueryOptions<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData,
  TQueryData = TQueryFnData
> = InfiniteQueryObserverOptions<TData, TError, TQueryFnData, TQueryData>;

export type UseBaseQueryResult<TData = unknown, TError = unknown> = Omit<
  QueryObserverResult<TData, TError>,
  'refetch'
> & {
  refetch: (
    options?: RefetchOptions
  ) => Observable<QueryObserverResult<TData, TError>>;
};

export type UseQueryResult<
  TData = unknown,
  TError = unknown
> = UseBaseQueryResult<TData, TError>;

export type UseInfiniteQueryResult<TData = unknown, TError = unknown> = Omit<
  InfiniteQueryObserverResult<TData, TError>,
  'fetchNextPage' | 'fetchPreviousPage' | 'refetch'
> & {
  refetch: (
    options?: RefetchOptions
  ) => Observable<QueryObserverResult<TData, TError>>;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Observable<InfiniteQueryObserverResult<TData, TError>>;
  fetchPreviousPage: (
    options?: FetchPreviousPageOptions
  ) => Observable<InfiniteQueryObserverResult<TData, TError>>;
};

export type UseMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = MutateOptionsObservable<TData, TError, TVariables, TContext> & {
  mutationFn?: MutationFunctionObservable<TData, TVariables>;
  mutationKey?: MutationKey;
  onMutate?: (
    variables: TVariables
  ) => Promise<TContext> | Observable<void> | TContext;
  retry?: RetryValue<TError>;
  retryDelay?: RetryDelayValue<TError>;
  useErrorBoundary?: boolean;
};

export type MutationFunctionObservable<
  TData = unknown,
  TVariables = unknown
> = (variables: TVariables) => Promise<TData> | Observable<TData>;

export type MutationOptionsWithObservable<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = MutateOptionsObservable<TData, TError, TVariables, TContext> & {
  mutationFn?: MutationFunctionObservable<TData, TVariables>;
  mutationKey?: MutationKey;
  variables?: TVariables;
  onMutate?: (
    variables: TVariables
  ) => Promise<TContext> | Observable<TContext> | TContext;
  retry?: RetryValue<TError>;
  retryDelay?: RetryDelayValue<TError>;
  _defaulted?: boolean;
};

export interface MutationObserverOptionsWithObservable<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> extends MutationOptionsWithObservable<TData, TError, TVariables, TContext> {
  useErrorBoundary?: boolean;
}

export type UseMutateFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = (
  variables: TVariables,
  options?: MutateOptionsObservable<TData, TError, TVariables, TContext>
) => void;

export type UseMutateAsyncFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = (
  variables: TVariables,
  options?: MutateOptionsObservable<TData, TError, TVariables, TContext>
) => Promise<TData>;

export type UseMutateObservable<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = (
  variables: TVariables,
  options?: MutateOptionsObservable<TData, TError, TVariables, TContext>
) => Observable<TData>;

export interface UseMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> {
  context: TContext | undefined;
  data: TData | undefined;
  error: TError | null;
  failureCount: number;
  isError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isPaused: boolean;
  isSuccess: boolean;
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>;
  mutateAsync: UseMutateAsyncFunction<TData, TError, TVariables, TContext>;
  mutateObs: UseMutateObservable<TData, TError, TVariables, TContext>;
  reset: () => void;
  status: MutationStatus;
  variables: TVariables | undefined;
}

export type FetchQueryOptionsWithObservable<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
> = Omit<FetchQueryOptions<TQueryFnData, TError, TData>, 'queryFn'> & {
  queryFn: QueryFunctionWithObservable;
};

export type FetchInfiniteQueryOptionsWithObservable<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
> = Omit<FetchInfiniteQueryOptions<TQueryFnData, TError, TData>, 'queryFn'> & {
  queryFn: QueryFunctionWithObservable;
};

export type UseQueryObservable<
  TData = unknown,
  TError = unknown
> = QueryObservable<UseQueryResult<TData, TError>>;

export type UseMutationObservable<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> = MutationObservable<UseMutationResult<TData, TError, TVariables, TContext>>;

export type UseInfiniteQueryObservable<
  TData = unknown,
  TError = unknown
> = InfiniteQueryObservable<UseInfiniteQueryResult<TData, TError>>;

export interface MutateOptionsObservable<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> {
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext
  ) => Promise<void> | Observable<void> | void;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | Observable<void> | void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | Observable<void> | void;
}
