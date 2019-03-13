import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

const config = {
  apiKey: "AIzaSyAd_NbUtGr1PVyTktNU3BlIpuIEWYCr_PA",
  authDomain: "student-guide-d0f67.firebaseapp.com",
  databaseURL: "https://student-guide-d0f67.firebaseio.com",
  projectId: "student-guide-d0f67",
  storageBucket: "student-guide-d0f67.appspot.com",
  messagingSenderId: "1021671317189"
};




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Edit',
      url: '/edit',
      icon: 'edit'
    },
    {
      title: 'Detail',
      url: '/detail',
      icon: 'detail'
    },
    {
      title: 'SMS Detail',
      url: '/sms-detail',
      icon: 'sms-detail'
    },
    {
      title: 'SMS',
      url: '/sms',
      icon: 'sms'
    }
  ];

  constructor(
    public sqlite: SQLite,
    private backgroundMode: BackgroundMode,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.backgroundMode.enable();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.createDB();

    });
    firebase.initializeApp(config);
  }
  createDB() {
    if (this.platform.is('cordova')) {
      this.sqlite.create({
        name: 'autoresponse.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS response(id INTEGER PRIMARY KEY AUTOINCREMENT,message TEXT,contacts TEXT,starttime TEXT,endtime TEXT, date TEXT);', []).then(() => console.log('Executed SQL 1 database created ')).catch(e => console.log(e));
      }).catch(e => console.log(e));
    }
  }
}
