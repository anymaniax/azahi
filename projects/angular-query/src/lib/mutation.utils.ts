import { BehaviorSubject, Observable } from 'rxjs';
import { UseMutationResult } from './types';

export class MutationBehavierSubject<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> extends BehaviorSubject<
  UseMutationResult<TData, TError, TVariables, TContext>
> {
  constructor(value: UseMutationResult<TData, TError, TVariables, TContext>) {
    super(value);
  }

  asObservableWithMutate(): MutationObservable<
    UseMutationResult<TData, TError, TVariables, TContext>
  > {
    const observable: any = new MutationObservable<
      UseMutationResult<TData, TError, TVariables, TContext>
    >(this.value);
    observable.source = this;
    return observable;
  }
}

export class MutationObservable<
  Result extends UseMutationResult = UseMutationResult
> extends Observable<Result> {
  public mutate: Result['mutate'];
  public mutateAsync: Result['mutateAsync'];
  public reset: Result['reset'];
  constructor({ mutate, mutateAsync, reset }: Result) {
    super();
    this.mutate = mutate;
    this.mutateAsync = mutateAsync;
    this.reset = reset;
  }
}
