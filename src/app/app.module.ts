import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LeftmenuComponent } from './leftmenu/leftmenu.component';
import { TopPanelComponent } from './top-panel/top-panel.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { ProjectService } from './project.service';
import { ModalModule } from './_modal';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { ModalCreateProjectComponent } from './modal-create-project/modal-create-project.component';
import { DropdownMenuDirective } from './dropdown-menu.directive';
import { PopperModule } from './popper';

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    LeftmenuComponent,
    TopPanelComponent,
    ModalCreateProjectComponent,
    DropdownMenuDirective,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    ModalModule,
    PopperModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgxTrimDirectiveModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    AuthService,
    ProjectService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
