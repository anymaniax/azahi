import { AngularQueryClient } from './angular-query-client';
import { MutationBehavierSubject, MutationObservable } from './mutation.utils';
import {
  MutationFunction,
  MutationKey,
  MutationObserver,
  notifyManager,
} from './query-core/core';
import { noop, parseMutationArgs } from './query-core/core/utils';
import {
  UseMutateFunction,
  UseMutationOptions,
  UseMutationResult,
} from './types';

export class Mutation {
  constructor(private queryClient: AngularQueryClient) {}

  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationKey: MutationKey,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationKey: MutationKey,
    mutationFn?: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutationObservable<TData, TError, TVariables, TContext>;
  use<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    arg1:
      | MutationKey
      | MutationFunction<TData, TVariables>
      | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg2?:
      | MutationFunction<TData, TVariables>
      | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutationObservable<TData, TError, TVariables, TContext> {
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
