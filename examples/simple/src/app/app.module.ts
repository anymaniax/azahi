import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularQueryModule } from 'angular-query';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AngularQueryModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
