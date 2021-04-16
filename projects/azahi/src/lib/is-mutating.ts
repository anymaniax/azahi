import { Observable } from 'rxjs';
import { QueryClient } from './query-client';
import { notifyManager } from './query-core';
import { MutationFilters } from './query-core/core/utils';

export class IsMutating {
  constructor(private queryClient: QueryClient) {}

  use(filters?: MutationFilters): Observable<number> {
    let isMutating = this.queryClient.isMutating(filters);

    const isMutating$ = new Observable<number>((obs) =>
      this.queryClient.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          const newIsMutating = this.queryClient.isMutating(filters);
          if (isMutating !== newIsMutating) {
            isMutating = newIsMutating;
            obs.next(newIsMutating);
          }
        })
      )
    );

    return isMutating$;
  }
}
