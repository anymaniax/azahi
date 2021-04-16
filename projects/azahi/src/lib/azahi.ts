import { Inject, Injectable } from '@angular/core';
import { InfiniteQuery } from './infinite-query';
import { IsFetching } from './is-fetching';
import { IsMutating } from './is-mutating';
import { Mutation } from './mutation';
import { Queries } from './queries';
import { Query } from './query';
import { QueryClient } from './query-client';
import { QUERY_CLIENT_TOKEN } from './query-client-token';

@Injectable()
export class Azahi {
  constructor(@Inject(QUERY_CLIENT_TOKEN) public queryClient: QueryClient) {}

  useQuery = new Query(this.queryClient).use;
  useMutation = new Mutation(this.queryClient).use;
  useQueries = new Queries(this.queryClient).use;
  useInfiniteQuery = new InfiniteQuery(this.queryClient).use;
  isFetching = new IsFetching(this.queryClient).use;
  isMutating = new IsMutating(this.queryClient).use;
}
