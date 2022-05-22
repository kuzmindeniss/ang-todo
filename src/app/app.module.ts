import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LeftmenuComponent } from './leftmenu/leftmenu.component';
import { TopPanelComponent } from './top-panel/top-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    LeftmenuComponent,
    TopPanelComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
