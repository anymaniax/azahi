import { BehaviorSubject, Observable } from 'rxjs';
import { InfiniteQueryObserverResult } from './query-core';

export class InfiniteQueryBehavierSubject<
  TData = unknown,
  TError = unknown
> extends BehaviorSubject<InfiniteQueryObserverResult<TData, TError>> {
  constructor(value: InfiniteQueryObserverResult<TData, TError>) {
    super(value);
  }

  asObservableWithInfinite(): InfiniteQueryObservable<
    InfiniteQueryObserverResult<TData, TError>
  > {
    const observable: any = new InfiniteQueryObservable<
      InfiniteQueryObserverResult<TData, TError>
    >(this.value);
    observable.source = this;
    return observable;
  }
}

export class InfiniteQueryObservable<
  Result extends InfiniteQueryObserverResult = InfiniteQueryObserverResult
> extends Observable<Result> {
  public fetchNextPage: Result['fetchNextPage'];
  public fetchPreviousPage: Result['fetchPreviousPage'];
  public refetch: Result['refetch'];
  public remove: Result['remove'];
  constructor({ fetchNextPage, fetchPreviousPage, refetch, remove }: Result) {
    super();
    this.fetchNextPage = fetchNextPage;
    this.fetchPreviousPage = fetchPreviousPage;
    this.refetch = refetch;
    this.remove = remove;
  }
}
