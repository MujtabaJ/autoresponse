import { Component, OnInit } from '@angular/core';


import { AlertController, LoadingController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';


import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { DomSanitizer } from '@angular/platform-browser';

declare var SMS: any;

@Component({
  selector: 'app-setresponse',
  templateUrl: './setresponse.page.html',
  styleUrls: ['./setresponse.page.scss'],
})
export class SetresponsePage implements OnInit {


  messages: any;
  results: any;
  //router:Router;

  countNewSMSs = 0;

  

  //my response
  setedResponse: any = [];
  selectContacts: any = [];
  myresponse: string = "";
  starttime;
  endtime;
  date;
  customAlertOptions: any = {
    header: 'Select Numbers',
    subHeader: 'Response will be received by selected contacts',
    message: 'You can set your custom response for your contacts when you are buzy',
    translucent: true
  };
  public allContacts: any
  contactList = [];

  constructor(private sanitizer: DomSanitizer,
    private contacts: Contacts,
    private sqlite: SQLite,
    public router: Router, public loadingCtrl: LoadingController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public navCtrl: NavController, public androidPermissions: AndroidPermissions,
    public events: Events,
    public alertCtrl: AlertController) {


    this.contacts.find(
      ["displayName", "phoneNumbers", "photos"],
      { multiple: true, hasPhoneNumber: true }
    ).then((contacts) => {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].displayName !== null) {
          var contact = {};
          contact["name"] = contacts[i].displayName;
          contact["number"] = contacts[i].phoneNumbers[0].value;
          if (contacts[i].photos != null) {
            console.log(contacts[i].photos);
            contact["image"] = this.sanitizer.bypassSecurityTrustUrl(contacts[i].photos[0].value);
            console.log(contact);
          } else {
            contact["image"] = "assets/dummy-profile-pic.png";
          }
          this.contactList.push(contact);
        }
      }
    });

    console.log("all contacts list", this.contactList);

    this.results = [];
    this.messages = [];

  }
  sendTextMessage() {
    // Using nativa ionic SMS.
    //this.smsService.sendTextMessage(this.text.number, this.text.message);
    // Using cordova-sms-plugin.
    //this.sendSMS(this.text.number, this.text.message);
    this.sqlite.create({
      name: 'autoresponse.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql("INSERT INTO response(id, message,contacts, starttime, endtime, date) VALUES (?,?,?,?,?,?);", [null, this.myresponse, this.selectContacts, this.starttime, this.endtime, this.date]).then((data) => {
        console.log('Executed SQL data inserted');
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
  ngOnInit() {
  }

}
