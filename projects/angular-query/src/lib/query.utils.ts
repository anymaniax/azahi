import { BehaviorSubject, Observable } from 'rxjs';
import { RefetchOptions } from './query-core';
import { UseQueryResult } from './types';

export class QueryBehavierSubject<TData, TError> extends BehaviorSubject<
  UseQueryResult<TData, TError>
> {
  constructor(value: UseQueryResult<TData, TError>) {
    super(value);
  }

  asObservableWithQuery(): QueryObservable<TData, TError> {
    const observable: any = new QueryObservable<TData, TError>(this.value);
    observable.source = this;
    return observable;
  }
}

export class QueryObservable<TData, TError> extends Observable<
  UseQueryResult<TData, TError>
> {
  public refetch: (
    options?: RefetchOptions
  ) => Promise<UseQueryResult<TData, TError>>;
  public remove: () => void;
  constructor({ refetch, remove }: UseQueryResult<TData, TError>) {
    super();
    this.refetch = refetch;
    this.remove = remove;
  }
}
