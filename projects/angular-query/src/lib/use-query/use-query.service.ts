import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryKey } from '../query/core';
import { parseQueryArgs } from '../query/core/utils';
import {
  QueryFunctionWithObservable,
  UseQueryOptions,
  UseQueryResult,
} from '../types';
import { UseBaseQueryService } from '../use-base-query/use-base-query.service';

@Injectable({
  providedIn: 'root',
})
export class UseQueryService {
  constructor(private useBaseQueryService: UseBaseQueryService) {}

  public useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData
  >(
    options: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>>;
  useQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>>;
  useQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: QueryFunctionWithObservable<TQueryFnData>,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>>;
  useQuery<TQueryFnData, TError, TData = TQueryFnData>(
    arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
      | QueryFunctionWithObservable<TQueryFnData>
      | UseQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseQueryOptions<TQueryFnData, TError, TData>
  ): Observable<UseQueryResult<TData, TError>> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    const { useBaseQuery } = this.useBaseQueryService;
    return useBaseQuery(parsedOptions);
  }
}
