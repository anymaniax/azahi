import { NgModule } from '@angular/core';
import { QUERY_CLIENT } from './angular-query.token';
import { QueryCache, QueryClient } from './query/core';
import { UseBaseQueryService } from './use-base-query/use-base-query.service';
import { UseQueryService } from './use-query/use-query.service';

@NgModule({
  providers: [UseBaseQueryService, UseQueryService],
})
export class AngularQueryModule {
  static forRoot(queryCache = new QueryCache(), queryClient = new QueryClient({ queryCache })) {
    return {
      ngModule: AngularQueryModule,
      providers: [{ provide: QUERY_CLIENT, useValue: queryClient }],
    };
  }
}
