import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularQuery } from './angular-query';
import { AngularQueryClient } from './angular-query-client';
import { QueryClient } from './query-core/core';

@NgModule({
  providers: [AngularQuery],
})
export class AngularQueryModule {
  static forRoot(
    queryClient = new QueryClient()
  ): ModuleWithProviders<AngularQueryModule> {
    queryClient.mount();

    return {
      ngModule: AngularQueryModule,
      providers: [{ provide: AngularQueryClient, useValue: queryClient }],
    };
  }
}
