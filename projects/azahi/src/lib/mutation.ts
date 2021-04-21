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
  MutationObservable,
  parseMutationArgs,
  parseMutationResult,
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
      const parsedOptions = parseMutationArgs(mutateOptions);
      observer.mutate(variables, parsedOptions).catch(noop);
    };

    const initialResult = parseMutationResult(
      observer.getCurrentResult(),
      mutate
    );

    const mutationObservable = new MutationObservable<
      UseMutationResult<TData, TError, TVariables, TContext>
    >(initialResult, (obs) => {
      const firstResult = parseMutationResult(
        observer.getCurrentResult(),
        mutate
      );
      obs.next(firstResult);

      const unsubscribe = observer.subscribe(
        notifyManager.batchCalls((currentResult) =>
          obs.next(parseMutationResult(currentResult, mutate))
        )
      );

      return unsubscribe;
    });

    return mutationObservable;
  }
}
