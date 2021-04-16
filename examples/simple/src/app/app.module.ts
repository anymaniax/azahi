import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AzahiModule, QueryClient } from 'azahi';
import { AppComponent } from './app.component';

const queryClient = new QueryClient();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AzahiModule.forRoot(queryClient)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
