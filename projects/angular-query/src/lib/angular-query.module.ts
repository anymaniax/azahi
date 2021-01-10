import { ModuleWithProviders, NgModule } from '@angular/core';
import { BaseQueryService } from './base-query/base-query.service';
import { MutationService } from './mutation/mutation.service';
import { QueryClientService } from './query-client/query-client.service';
import { QueryClient } from './query-core/core';
import { QueryService } from './query/query.service';

@NgModule({
  providers: [BaseQueryService, QueryService, MutationService],
})
export class AngularQueryModule {
  static forRoot(
    queryClient = new QueryClient()
  ): ModuleWithProviders<AngularQueryModule> {
    queryClient.mount();

    return {
      ngModule: AngularQueryModule,
      providers: [{ provide: QueryClientService, useValue: queryClient }],
    };
  }
}
