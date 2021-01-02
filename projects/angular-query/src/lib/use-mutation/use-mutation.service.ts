import { Inject, Injectable } from '@angular/core';
import { QUERY_CLIENT } from '../angular-query.token';
import { MutationFunction, MutationKey, MutationObserver, notifyManager, QueryClient } from '../query/core';
import { noop, parseMutationArgs } from '../query/core/utils';
import { UseMutateFunction, UseMutationOptions, UseMutationResult } from '../types';
import { MutateBehavierSubject, MutateObservable } from './use-mutation.utils';

@Injectable({
  providedIn: 'root',
})
export class UseMutationService {
  constructor(@Inject(QUERY_CLIENT) private queryClient: QueryClient) {}

  useMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutateObservable<TData, TError, TVariables, TContext>;
  useMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutateObservable<TData, TError, TVariables, TContext>;
  useMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationKey: MutationKey,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutateObservable<TData, TError, TVariables, TContext>;
  useMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationKey: MutationKey,
    mutationFn?: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutateObservable<TData, TError, TVariables, TContext>;
  useMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    arg1: MutationKey | MutationFunction<TData, TVariables> | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg2?: MutationFunction<TData, TVariables> | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): MutateObservable<TData, TError, TVariables, TContext> {
    const options = parseMutationArgs(arg1, arg2, arg3);

    const observer = new MutationObserver(this.queryClient, options);

    const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    };

    const initialResult = observer.getCurrentResult();
    const initialMutationResult: UseMutationResult<TData, TError, TVariables, TContext> = {
      ...initialResult,
      mutate,
      mutateAsync: initialResult.mutate,
    };

    const state$ = new MutateBehavierSubject<TData, TError, TVariables, TContext>(initialMutationResult);

    observer.subscribe(
      notifyManager.batchCalls((currentResult) => {
        state$.next({ ...currentResult, mutate, mutateAsync: currentResult.mutate });
      })
    );

    // Update options
    if (observer.hasListeners()) {
      observer.setOptions(options);
    }

    return state$.asObservableWithMutate();
  }
}
