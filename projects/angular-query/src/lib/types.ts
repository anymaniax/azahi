import { Observable } from 'rxjs';
import { InfiniteQueryObservable } from './infinite-query.utils';
import { MutationObservable } from './mutation.utils';
import { RetryDelayValue, RetryValue } from './query-core/core/retryer';
import {
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  MutateOptions,
  MutationStatus,
  QueryObserverOptions,
  QueryObserverResult,
} from './query-core/core/types';
import { QueryObservable } from './query.utils';

export type QueryFunctionWithObservable<T = unknown> = (
  ...args: any[]
) => T | Promise<T> | Observable<T>;

export interface UseBaseQueryOptions<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData,
  TQueryData = TQueryFnData
> extends Omit<
    QueryObserverOptions<TData, TError, TQueryFnData, TQueryData>,
    'queryFn'
  > {
  queryFn?: QueryFunctionWithObservable<TQueryFnData>;
}

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

export type UseBaseQueryResult<
  TData = unknown,
  TError = unknown
> = QueryObserverResult<TData, TError>;

export type UseQueryResult<
  TData = unknown,
  TError = unknown
> = UseBaseQueryResult<TData, TError>;

export type UseInfiniteQueryResult<
  TData = unknown,
  TError = unknown
> = InfiniteQueryObserverResult<TData, TError>;

export interface UseMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> {
  mutationKey?: string | unknown[];
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | void;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | void;
  retry?: RetryValue<TError>;
  retryDelay?: RetryDelayValue;
  useErrorBoundary?: boolean;
}

export type MutationFunctionObservable<
  TData = unknown,
  TVariables = unknown
> = (variables: TVariables) => Promise<TData> | Observable<TData>;

export type UseMutateFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = (
  variables: TVariables,
  options?: MutateOptions<TData, TError, TVariables, TContext>
) => void;

export type UseMutateAsyncFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = (
  variables: TVariables,
  options?: MutateOptions<TData, TError, TVariables, TContext>
) => Promise<TData>;

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
  reset: () => void;
  status: MutationStatus;
  variables: TVariables | undefined;
}

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
> = InfiniteQueryObservable<InfiniteQueryObserverResult<TData, TError>>;
