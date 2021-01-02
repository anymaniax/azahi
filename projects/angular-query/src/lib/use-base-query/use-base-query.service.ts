import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QUERY_CLIENT } from '../angular-query.token';
import { notifyManager } from '../query';
import {
  QueryClient,
  QueryFunction,
  QueryObserver,
  QueryObserverResult,
} from '../query/core';
import { QueryFunctionWithObservable, UseBaseQueryOptions } from '../types';
import { setBatchCalls } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class UseBaseQueryService {
  constructor(@Inject(QUERY_CLIENT) private queryClient: QueryClient) {
    this.useBaseQuery = this.useBaseQuery.bind(this);
  }

  public useBaseQuery<TQueryFnData, TError, TData, TQueryData>(
    options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData>
  ) {
    const optionsQueryFnDataPromise = this.getOptionsWithQueryFnDataPromise(
      options
    );

    let defaultedOptions = this.queryClient.defaultQueryObserverOptions(
      optionsQueryFnDataPromise
    );

    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls(defaultedOptions);

    const observer = new QueryObserver<any, any, any, any>(
      this.queryClient,
      defaultedOptions
    );

    if (observer.hasListeners()) {
      observer.setOptions(defaultedOptions);
    }

    const currentResult = observer.getCurrentResult();

    const subject: BehaviorSubject<
      QueryObserverResult<TData, TError>
    > = new BehaviorSubject<QueryObserverResult<TData, TError>>(currentResult);

    observer.subscribe(
      notifyManager.batchCalls((result) => subject.next(result))
    );

    return subject.asObservable();
  }

  getOptionsWithQueryFnDataPromise<TData, TError, TQueryFnData, TQueryData>(
    options: UseBaseQueryOptions<TData, TError, TQueryFnData, TQueryData>
  ) {
    return {
      ...options,
      queryFn: this.getQueryFnDataPromise(options.queryFn),
    };
  }
  getQueryFnDataPromise<TQueryFnData>(
    queryFn: QueryFunctionWithObservable<TQueryFnData>
  ): QueryFunction<TQueryFnData> {
    if (!queryFn) {
      return queryFn as QueryFunction<TQueryFnData>;
    }

    return (...args) => {
      const res = queryFn(...args);

      if (this.isObservable<TQueryFnData>(res)) {
        return res.toPromise();
      }

      return res;
    };
  }

  isObservable<T>(res: any): res is Observable<T> {
    return !!res.toPromise && !!res.subscribe;
  }
}
