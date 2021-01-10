import { Injectable } from '@angular/core';
import { AngularQueryClient } from './angular-query-client';
import { Mutation } from './mutation';
import { Queries } from './queries';
import { Query } from './query';

@Injectable()
export class AngularQuery {
  constructor(private queryClient: AngularQueryClient) {}

  useQuery = new Query(this.queryClient).use;
  useMutation = new Mutation(this.queryClient).use;
  useQueries = new Queries(this.queryClient).use;
}
