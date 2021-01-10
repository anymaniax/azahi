import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QueryClientService } from '../query-client/query-client.service';
import { notifyManager } from '../query-core';
import {
  QueryFunction,
  QueryObserver,
  QueryObserverResult,
} from '../query-core/core';
import { QueryFunctionWithObservable, UseBaseQueryOptions } from '../types';
import { setBatchCalls } from '../utils';

@Injectable()
export class BaseQueryService {
  constructor(private queryClient: QueryClientService) {
    this.use = this.use.bind(this);
  }

  public use<TQueryFnData, TError, TData, TQueryData>(
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
