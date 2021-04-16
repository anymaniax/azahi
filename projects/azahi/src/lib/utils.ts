import { from, Observable, Subject, Subscriber, TeardownLogic } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  InfiniteQueryObserverResult,
  MutationKey,
  MutationOptions,
  notifyManager,
  QueryFunction,
  QueryKey,
  QueryObserverOptions,
} from './query-core';
import { isQueryKey } from './query-core/core/utils';
import {
  MutationFunctionObservable,
  MutationOptionsWithObservable,
  QueryFunctionWithObservable,
  QueryOptionsWithObservable,
  UseMutateAsyncFunction,
  UseMutateObservable,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from './types';

export const setBatchCalls = <Options extends QueryObserverOptions>(
  options: Options
): Options => {
  if (options.onError) {
    options.onError = notifyManager.batchCalls(options.onError);
  }

  if (options.onSuccess) {
    options.onSuccess = notifyManager.batchCalls(options.onSuccess);
  }

  if (options.onSettled) {
    options.onSettled = notifyManager.batchCalls(options.onSettled);
  }
  return options;
};

export const getQueriesOptionsWithQueryFnDataPromise = (
  queries: UseQueryOptions[]
) => queries.map((options) => parseQueryArgs(options));

export const getQueryFnDataPromise = <TQueryFnData>(
  queryFn: QueryFunctionWithObservable<TQueryFnData>
): QueryFunction<TQueryFnData> => {
  if (!queryFn) {
    return queryFn as QueryFunction<TQueryFnData>;
  }

  return (...args) => {
    const res = queryFn(...args);

    if (isObservable<TQueryFnData>(res)) {
      const destroy$ = new Subject();
      const promise = res.pipe(takeUntil(destroy$)).toPromise();

      // @ts-ignore
      promise.cancel = () => {
        destroy$.next();
        destroy$.complete();
      };

      return promise;
    }

    return res;
  };
};

export const getMutateObservable = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutateObs: UseMutateAsyncFunction<TData, TError, TVariables, TContext>
): UseMutateObservable<TData, TError, TVariables, TContext> => (...args) => {
  const res = mutateObs(...args);

  return from(res);
};

export const isObservable = <T>(res: any): res is Observable<T> =>
  !!res && !!res.toPromise && !!res.subscribe;

export const parseQueryArgs = <
  TOptions extends QueryOptionsWithObservable<any, any, any>
>(
  arg1: QueryKey | TOptions,
  arg2?: QueryFunctionWithObservable<any> | TOptions,
  arg3?: TOptions
): Omit<TOptions, 'queryFn'> & {
  queryFn: QueryFunction<any>;
} => {
  if (!isQueryKey(arg1)) {
    return {
      ...arg1,
      queryFn: getQueryFnDataPromise(arg1.queryFn),
    } as Omit<TOptions, 'queryFn'> & {
      queryFn: QueryFunction<any>;
    };
  }

  if (typeof arg2 === 'function') {
    return {
      ...arg3,
      queryKey: arg1,
      queryFn: getQueryFnDataPromise(arg2),
    } as Omit<TOptions, 'queryFn'> & {
      queryFn: QueryFunction<any>;
    };
  }

  return {
    ...arg2,
    queryFn: getQueryFnDataPromise(arg2.queryFn),
    queryKey: arg1,
  } as Omit<TOptions, 'queryFn'> & {
    queryFn: QueryFunction<any>;
  };
};

export const parseMutationArgs = (
  arg1:
    | MutationKey
    | MutationFunctionObservable<any, any>
    | MutationOptionsWithObservable<any, any, any, any>,
  arg2?:
    | MutationFunctionObservable<any, any>
    | MutationOptionsWithObservable<any, any, any, any>,
  arg3?: MutationOptionsWithObservable<any, any, any, any>
): MutationOptions<any, any, any, any> => {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === 'function') {
      return {
        ...arg3,
        mutationKey: arg1,
        mutationFn: getQueryFnDataPromise(arg2),
        onMutate: getQueryFnDataPromise(arg3?.onMutate),
        onSuccess: getQueryFnDataPromise(arg3?.onSuccess),
        onError: getQueryFnDataPromise(arg3?.onError),
        onSettled: getQueryFnDataPromise(arg3?.onSettled),
      } as MutationOptions<any, any, any, any>;
    }
    return {
      ...arg2,
      mutationFn: getQueryFnDataPromise(arg2.mutationFn),
      onMutate: getQueryFnDataPromise(arg3?.onMutate),
      onSuccess: getQueryFnDataPromise(arg3?.onSuccess),
      onError: getQueryFnDataPromise(arg3?.onError),
      onSettled: getQueryFnDataPromise(arg3?.onSettled),
      mutationKey: arg1,
    } as MutationOptions<any, any, any, any>;
  }

  if (typeof arg1 === 'function') {
    return {
      ...arg2,
      mutationFn: getQueryFnDataPromise(arg1),
      onMutate: getQueryFnDataPromise(
        (arg2 as MutationOptionsWithObservable)?.onMutate
      ),
      onSuccess: getQueryFnDataPromise(
        (arg2 as MutationOptionsWithObservable)?.onSuccess
      ),
      onError: getQueryFnDataPromise(
        (arg2 as MutationOptionsWithObservable)?.onError
      ),
      onSettled: getQueryFnDataPromise(
        (arg2 as MutationOptionsWithObservable)?.onSettled
      ),
    } as MutationOptions<any, any, any, any>;
  }

  return {
    ...arg1,
    mutationFn: getQueryFnDataPromise(arg1.mutationFn),
    onMutate: getQueryFnDataPromise(arg1?.onMutate),
    onSuccess: getQueryFnDataPromise(arg1?.onSuccess),
    onError: getQueryFnDataPromise(arg1?.onError),
    onSettled: getQueryFnDataPromise(arg1?.onSettled),
  } as MutationOptions<any, any, any, any>;
};

export class QueryObservable<
  Result extends UseQueryResult = UseQueryResult
> extends Observable<Result> {
  public refetch: Result['refetch'];
  public remove: Result['remove'];
  constructor(
    { refetch, remove }: Result,
    subscribe?: (
      this: Observable<Result>,
      subscriber: Subscriber<Result>
    ) => TeardownLogic
  ) {
    super(subscribe);
    this.refetch = refetch;
    this.remove = remove;
  }
}

export class InfiniteQueryObservable<
  Result extends InfiniteQueryObserverResult = InfiniteQueryObserverResult
> extends Observable<Result> {
  public fetchNextPage: Result['fetchNextPage'];
  public fetchPreviousPage: Result['fetchPreviousPage'];
  public refetch: Result['refetch'];
  public remove: Result['remove'];
  constructor(
    { fetchNextPage, fetchPreviousPage, refetch, remove }: Result,
    subscribe?: (
      this: Observable<Result>,
      subscriber: Subscriber<Result>
    ) => TeardownLogic
  ) {
    super(subscribe);
    this.fetchNextPage = fetchNextPage;
    this.fetchPreviousPage = fetchPreviousPage;
    this.refetch = refetch;
    this.remove = remove;
  }
}

export class MutationObservable<
  Result extends UseMutationResult = UseMutationResult
> extends Observable<Result> {
  public mutate: Result['mutate'];
  public mutateAsync: Result['mutateAsync'];
  public mutateObs: Result['mutateObs'];
  public reset: Result['reset'];
  constructor(
    { mutate, mutateAsync, mutateObs, reset }: Result,
    subscribe?: (
      this: Observable<Result>,
      subscriber: Subscriber<Result>
    ) => TeardownLogic
  ) {
    super(subscribe);
    this.mutate = mutate;
    this.mutateAsync = mutateAsync;
    this.mutateObs = mutateObs;
    this.reset = reset;
  }
}
