import { AngularQueryClient } from './angular-query-client';
import { MutationBehavierSubject } from './mutation.utils';
import {
  MutationKey,
  MutationObserver,
  MutationOptions,
  notifyManager,
} from './query-core/core';
import { isQueryKey, noop } from './query-core/core/utils';
import {
  MutationFunctionObservable,
  UseMutateFunction,
  UseMutationObservable,
  UseMutationOptions,
  UseMutationResult,
} from './types';
import { getQueryFnDataPromise } from './utils';

const parseMutationArgs = <
  TOptions extends MutationOptions<any, any, any, any>
>(
  arg1: MutationKey | MutationFunctionObservable<any, any> | TOptions,
  arg2?: MutationFunctionObservable<any, any> | TOptions,
  arg3?: TOptions
): TOptions => {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === 'function') {
      return {
        ...arg3,
        mutationKey: arg1,
        mutationFn: getQueryFnDataPromise(arg2),
      } as TOptions;
    }
    return { ...arg2, mutationKey: arg1 } as TOptions;
  }

  if (typeof arg1 === 'function') {
    return { ...arg2, mutationFn: getQueryFnDataPromise(arg1) } as TOptions;
  }

  return { ...arg1 } as TOptions;
};

export class Mutation {
  constructor(private queryClient: AngularQueryClient) {}

  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: MutationFunctionObservable<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationKey: MutationKey,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationKey: MutationKey,
    mutationFn?: MutationFunctionObservable<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    arg1:
      | MutationKey
      | MutationFunctionObservable<TData, TVariables>
      | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg2?:
      | MutationFunctionObservable<TData, TVariables>
      | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationObservable<TData, TError, TVariables, TContext> {
    const options = parseMutationArgs(arg1, arg2, arg3);

    const observer = new MutationObserver(this.queryClient, options);

    const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (
      variables,
      mutateOptions
    ) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    };

    const initialResult = observer.getCurrentResult();
    const initialMutationResult: UseMutationResult<
      TData,
      TError,
      TVariables,
      TContext
    > = {
      ...initialResult,
      mutate,
      mutateAsync: initialResult.mutate,
    };

    const state$ = new MutationBehavierSubject<
      TData,
      TError,
      TVariables,
      TContext
    >(initialMutationResult);

    observer.subscribe(
      notifyManager.batchCalls((currentResult) => {
        state$.next({
          ...currentResult,
          mutate,
          mutateAsync: currentResult.mutate,
        });
      })
    );

    // Update options
    if (observer.hasListeners()) {
      observer.setOptions(options);
    }

    return state$.asObservableWithMutate();
  }
}
