import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseBaseQueryService } from '../use-base-query/use-base-query.service';
import { UseQueryOptions, UseQueryResult } from '../types';
import { parseQueryArgs } from '../query/core/utils';
import { QueryFunction, QueryKey } from '../query/core';

@Injectable({
  providedIn: 'root',
})
export class UseQueryService {
  constructor(private useBaseQueryService: UseBaseQueryService) {}

  public useQuery<TData = unknown, TError = unknown, TQueryFnData = TData>(
    options: UseQueryOptions<TData, TError, TQueryFnData>
  ): Observable<UseQueryResult<TData, TError>>;
  useQuery<TData = unknown, TError = unknown, TQueryFnData = TData>(
    queryKey: QueryKey,
    options?: UseQueryOptions<TData, TError, TQueryFnData>
  ): Observable<UseQueryResult<TData, TError>>;
  useQuery<TData = unknown, TError = unknown, TQueryFnData = TData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TQueryFnData | TData>,
    options?: UseQueryOptions<TData, TError, TQueryFnData>
  ): Observable<UseQueryResult<TData, TError>>;
  useQuery<TData, TError, TQueryFnData = TData>(
    arg1: QueryKey | UseQueryOptions<TData, TError, TQueryFnData>,
    arg2?: QueryFunction<TData | TQueryFnData> | UseQueryOptions<TData, TError, TQueryFnData>,
    arg3?: UseQueryOptions<TData, TError, TQueryFnData>
  ): Observable<UseQueryResult<TData, TError>> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    const { useBaseQuery } = this.useBaseQueryService;
    return useBaseQuery(parsedOptions);
  }
}
