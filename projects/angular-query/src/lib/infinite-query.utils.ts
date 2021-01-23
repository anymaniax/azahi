import { BehaviorSubject, Observable } from 'rxjs';
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from './query-core';

export class InfiniteQueryBehavierSubject<
  TData,
  TError
> extends BehaviorSubject<InfiniteQueryObserverResult<TData, TError>> {
  constructor(value: InfiniteQueryObserverResult<TData, TError>) {
    super(value);
  }

  asObservableWithInfinite(): InfiniteQueryObservable<TData, TError> {
    const observable: any = new InfiniteQueryObservable<TData, TError>(
      this.value
    );
    observable.source = this;
    return observable;
  }
}

export class InfiniteQueryObservable<TData, TError> extends Observable<
  InfiniteQueryObserverResult<TData, TError>
> {
  public fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<TData, TError>>;
  public fetchPreviousPage: (
    options?: FetchPreviousPageOptions
  ) => Promise<InfiniteQueryObserverResult<TData, TError>>;
  public refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<InfiniteData<TData>, TError>>;
  public remove: () => void;
  constructor({
    fetchNextPage,
    fetchPreviousPage,
    refetch,
    remove,
  }: InfiniteQueryObserverResult<TData, TError>) {
    super();
    this.fetchNextPage = fetchNextPage;
    this.fetchPreviousPage = fetchPreviousPage;
    this.refetch = refetch;
    this.remove = remove;
  }
}
