import { Observable } from 'rxjs';
import { QueryClient } from './query-client';
import { notifyManager, QueryKey } from './query-core';
import { parseFilterArgs, QueryFilters } from './query-core/core/utils';
export class IsFetching {
  constructor(private queryClient: QueryClient) {}

  use(filters?: QueryFilters): Observable<number>;
  use(queryKey?: QueryKey, filters?: QueryFilters): Observable<number>;
  use(arg1?: QueryKey | QueryFilters, arg2?: QueryFilters): Observable<number> {
    const [filters] = parseFilterArgs(arg1, arg2);

    let isFetching = this.queryClient.isFetching(filters);

    const isFetching$ = new Observable<number>((obs) =>
      this.queryClient.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          const newIsFetching = this.queryClient.isFetching(filters);
          if (isFetching !== newIsFetching) {
            isFetching = newIsFetching;
            obs.next(newIsFetching);
          }
        })
      )
    );

    return isFetching$;
  }
}
