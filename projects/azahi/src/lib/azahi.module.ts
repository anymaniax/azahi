import { ModuleWithProviders, NgModule } from '@angular/core';
import { Azahi } from './azahi';
import { QueryClient } from './query-client';
import { QUERY_CLIENT_TOKEN } from './query-client-token';

@NgModule({
  providers: [Azahi],
})
export class AzahiModule {
  static forRoot(
    queryClient = new QueryClient()
  ): ModuleWithProviders<AzahiModule> {
    queryClient.mount();

    return {
      ngModule: AzahiModule,
      providers: [{ provide: QUERY_CLIENT_TOKEN, useValue: queryClient }],
    };
  }
}
