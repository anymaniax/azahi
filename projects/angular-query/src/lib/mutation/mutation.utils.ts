import { BehaviorSubject, Observable } from 'rxjs';
import { UseMutateFunction, UseMutationResult } from '../types';

export class MutateBehavierSubject<
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

  asObservableWithMutate(): MutateObservable<
    TData,
    TError,
    TVariables,
    TContext
  > {
    const observable: any = new MutateObservable<
      TData,
      TError,
      TVariables,
      TContext
    >(this.value);
    observable.source = this;
    return observable;
  }
}

export class MutateObservable<
  TData,
  TError,
  TVariables,
  TContext
> extends Observable<UseMutationResult<TData, TError, TVariables, TContext>> {
  public mutate: UseMutateFunction<TData, TError, TVariables, TContext>;
  public reset: () => void;
  constructor({
    mutate,
    reset,
  }: UseMutationResult<TData, TError, TVariables, TContext>) {
    super();
    this.mutate = mutate;
    this.reset = reset;
  }
}
