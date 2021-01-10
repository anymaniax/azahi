import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseQueryService } from '../base-query/base-query.service';
import { QueryKey } from '../query-core';
import { parseQueryArgs } from '../query-core/core/utils';
import {
  QueryFunctionWithObservable,
  UseQueryOptions,
  UseQueryResult,
} from '../types';

@Injectable()
export class QueryService {
  constructor(private baseQueryService: BaseQueryService) {}

  public use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    options: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>>;
  use<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable<TQueryFnData>,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>>;
  use<TQueryFnData, TError, TData = TQueryFnData>(
    arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
      | QueryFunctionWithObservable<TQueryFnData>
      | UseQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

    return this.baseQueryService.use(parsedOptions);
  }
}
