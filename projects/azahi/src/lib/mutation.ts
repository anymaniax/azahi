import { QueryClient } from './query-client';
import {
  MutationKey,
  MutationObserver,
  notifyManager,
} from './query-core/core';
import { noop } from './query-core/core/utils';
import {
  MutationFunctionObservable,
  UseMutateFunction,
  UseMutationObservable,
  UseMutationOptions,
  UseMutationResult,
} from './types';
import {
  getMutateObservable,
  MutationObservable,
  parseMutationArgs,
} from './utils';

export class Mutation {
  constructor(private queryClient: QueryClient) {}

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

    const observer = new MutationObserver(this.queryClient.core, options);

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
      mutateObs: getMutateObservable(initialResult.mutate),
    };

    const mutationObservable = new MutationObservable<
      UseMutationResult<TData, TError, TVariables, TContext>
    >(initialMutationResult, (obs) => {
      const firstResult = observer.getCurrentResult();
      const firstMutationResult: UseMutationResult<
        TData,
        TError,
        TVariables,
        TContext
      > = {
        ...firstResult,
        mutate,
        mutateAsync: firstResult.mutate,
        mutateObs: getMutateObservable(firstResult.mutate),
      };
      obs.next(firstMutationResult);

      const unsubscribe = observer.subscribe(
        notifyManager.batchCalls((currentResult) =>
          obs.next({
            ...currentResult,
            mutate,
            mutateAsync: currentResult.mutate,
            mutateObs: getMutateObservable(initialResult.mutate),
          })
        )
      );

      return unsubscribe;
    });

    return mutationObservable;
  }
}
