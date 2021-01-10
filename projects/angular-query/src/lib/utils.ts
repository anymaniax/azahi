import { Observable } from 'rxjs';
import {
  notifyManager,
  QueryFunction,
  QueryObserverOptions,
} from './query-core';
import { QueryFunctionWithObservable, UseQueryOptions } from './types';

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
) => queries.map((options) => getOptionsWithQueryFnDataPromise(options));

export const getOptionsWithQueryFnDataPromise = <
  TData,
  TError,
  TQueryFnData,
  TQueryData
>(
  options: QueryObserverOptions<TData, TError, TQueryFnData, TQueryData>
) => ({
  ...options,
  queryFn: getQueryFnDataPromise(options.queryFn),
});

export const getQueryFnDataPromise = <TQueryFnData>(
  queryFn: QueryFunctionWithObservable<TQueryFnData>
): QueryFunction<TQueryFnData> => {
  if (!queryFn) {
    return queryFn as QueryFunction<TQueryFnData>;
  }

  return (...args) => {
    const res = queryFn(...args);

    if (isObservable<TQueryFnData>(res)) {
      return res.toPromise();
    }

    return res;
  };
};

export const isObservable = <T>(res: any): res is Observable<T> =>
  !!res.toPromise && !!res.subscribe;
