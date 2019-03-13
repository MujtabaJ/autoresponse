import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FormatDatePipe } from './format-date.pipe';
import { SMS } from '@ionic-native/sms/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// Import Froala Editor.
import "froala-editor/js/froala_editor.pkgd.min.js";

// Import Angular2 plugin.
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [AppComponent, FormatDatePipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    AndroidPermissions,
    SMS,
    BackgroundMode,
    Contacts,
    SQLite,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
