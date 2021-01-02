import { ModuleWithProviders, NgModule } from '@angular/core';
import { QUERY_CLIENT } from './angular-query.token';
import { QueryClient } from './query/core';
import { UseBaseQueryService } from './use-base-query/use-base-query.service';
import { UseMutationService } from './use-mutation/use-mutation.service';
import { UseQueryService } from './use-query/use-query.service';

@NgModule({
  providers: [UseBaseQueryService, UseQueryService, UseMutationService],
})
export class AngularQueryModule {
  static forRoot(
    queryClient = new QueryClient()
  ): ModuleWithProviders<AngularQueryModule> {
    queryClient.mount();

    return {
      ngModule: AngularQueryModule,
      providers: [{ provide: QUERY_CLIENT, useValue: queryClient }],
    };
  }
}
