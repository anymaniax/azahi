import { BehaviorSubject, Observable } from 'rxjs';
import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  UseMutationResult,
} from './types';

export class MutationBehavierSubject<
  TData,
  TError,
  TVariables,
  TContext
> extends BehaviorSubject<
  UseMutationResult<TData, TError, TVariables, TContext>
> {
  constructor(value: UseMutationResult<TData, TError, TVariables, TContext>) {
    super(value);
  }

  asObservableWithMutate(): MutationObservable<
    TData,
    TError,
    TVariables,
    TContext
  > {
    const observable: any = new MutationObservable<
      TData,
      TError,
      TVariables,
      TContext
    >(this.value);
    observable.source = this;
    return observable;
  }
}

export class MutationObservable<
  TData,
  TError,
  TVariables,
  TContext
> extends Observable<UseMutationResult<TData, TError, TVariables, TContext>> {
  public mutate: UseMutateFunction<TData, TError, TVariables, TContext>;
  public mutateAsync: UseMutateAsyncFunction<
    TData,
    TError,
    TVariables,
    TContext
  >;
  public reset: () => void;
  constructor({
    mutate,
    mutateAsync,
    reset,
  }: UseMutationResult<TData, TError, TVariables, TContext>) {
    super();
    this.mutate = mutate;
    this.mutateAsync = mutateAsync;
    this.reset = reset;
  }
}
