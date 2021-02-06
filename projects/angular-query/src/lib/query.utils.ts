import { BehaviorSubject, Observable } from 'rxjs';
import { UseQueryResult } from './types';

export class QueryBehaviorSubject<
  TData = unknown,
  TError = unknown
> extends BehaviorSubject<UseQueryResult<TData, TError>> {
  constructor(value: UseQueryResult<TData, TError>) {
    super(value);
  }

  asObservableWithQuery(): QueryObservable<UseQueryResult<TData, TError>> {
    const observable: any = new QueryObservable<UseQueryResult<TData, TError>>(
      this.value
    );
    observable.source = this;
    return observable;
  }
}

export class QueryObservable<
  Result extends UseQueryResult = UseQueryResult
> extends Observable<Result> {
  public refetch: Result['refetch'];
  public remove: Result['remove'];
  constructor({ refetch, remove }: Result) {
    super();
    this.refetch = refetch;
    this.remove = remove;
  }
}
