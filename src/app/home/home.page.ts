import { Component } from '@angular/core';
import { NavController, Platform, Events, LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'Firebase';

import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions, } from "@angular/http";
declare var SMS: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']

})
export class HomePage {

  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "/assets/imgs/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "/assets/imgs/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "/assets/imgs/ica-slidebox-img-3.png",
    }
  ];

  isApp: boolean;
  masks: any;

  text = {
    "number": "",
    "message": "",
  };

  messages: any;
  results: any;
  //router:Router;

  countNewSMSs = 0;

  infos = [];
  ref = firebase.database().ref('infos/');

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


  constructor(
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private contacts: Contacts,
    private sqlite: SQLite, public http: Http,
    public router: Router, public loadingCtrl: LoadingController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public navCtrl: NavController, public androidPermissions: AndroidPermissions,
    public events: Events,
    public alertCtrl: AlertController) {

    // var headers = new Headers();
    // headers.append("Accept", 'application/json');
    // headers.append('Content-Type', 'application/json');
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // const requestOptions = new RequestOptions({ headers: headers });
    // let postData = "username=1003&password=12345678&grant_type=password";
    // this.http.post("https://devmarami.azurewebsites.net/token", postData, requestOptions).subscribe(data => {console.log("here is the value",data); }, error => {console.log("here is the error",error); });

    // var str = "Payment journal is created, # is  GBN000066"
    // var result = str.slice(34);
    // console.log(result);
    var standardsList = [
      {
        "InventSiteId": "VAN",
        "ItemId": "102S",
        "LocationId": "1003",
        "Price": "0",
        "UnitId": "KG",
        "inventBatchId": "181231-MFIC-000001",
        "itemName": "Potato Plain Chips-رقائق البطاطا السادة",
        "qty": "1000"
      },
      {
        "InventSiteId": "VAN",
        "ItemId": "102S",
        "LocationId": "1003",
        "Price": "0",
        "UnitId": "KG",
        "inventBatchId": "181231-MFIC-000002",
        "itemName": "Potato Plain Chips-رقائق البطاطا السادة",
        "qty": "2000"
      },
      { "Grade": "Math K", "Domain": "Counting & Cardinality" },
      { "Grade": "Math K", "Domain": "Counting & Cardinality" },
      { "Grade": "Math K", "Domain": "Counting & Cardinality" },
      { "Grade": "Math K", "Domain": "Geometry" },
      { "Grade": "Math 1", "Domain": "Counting & Cardinality" },
      { "Grade": "Math 1", "Domain": "Counting & Cardinality" },
      { "Grade": "Math 1", "Domain": "Orders of Operation" },
      { "Grade": "Math 2", "Domain": "Geometry" },
      { "Grade": "Math 2", "Domain": "Geometry" }
    ];
    var grades = {};
    standardsList.forEach(function (item) {
      var grade = grades[item.ItemId] = grades[item.ItemId] || {};
      grade[item.ItemId] = true;
    });

    var arrayWithDuplicates = [
      { "type": "LICENSE", "licenseNum": "12345", state: "NV" },
      { "type": "LICENSE", "licenseNum": "A7846", state: "CA" },
      { "type": "LICENSE", "licenseNum": "12345", state: "OR" },
      { "type": "LICENSE", "licenseNum": "10849", state: "CA" },
      { "type": "LICENSE", "licenseNum": "B7037", state: "WA" },
      { "type": "LICENSE", "licenseNum": "12345", state: "NM" }
    ];



    var uniqueArray = this.removeDuplicates(arrayWithDuplicates, "licenseNum");
    console.log("uniqueArray is: " + JSON.stringify(uniqueArray));
    console.log(JSON.stringify(grades, null, 4));

    this.platform.backButton.subscribe(() => {

      navigator['app'].exitApp();
    });

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

    this.masks = {
      phoneNumber: ['(', '+', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
      cardNumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
      orderCode: [/[a-zA-z]/, ':', /\d/, /\d/, /\d/, /\d/]
    };
    this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost'));
    if (this.isApp) {
      console.log("if chal gia device p he ");
      this.waitingForSMS()
        .then(sms => {
          this.countNewSMSs += 1;
          console.log("1", this.countNewSMSs += 1);
        })
    }
    else {
      console.log("Web Browser.");
      this.showAlert();
    }

    this.ref.on('value', resp => {
      this.infos = [];
      this.infos = snapshotToArray(resp);
    });



    console.log("1");
    events.subscribe('onSMSArrive', (sms) => {
      // Sms is the same argument passed in `events.publish(sms)`.
      console.log('onSMSArrive', sms);

      this.readListSMS2();
    });
  }
  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
  ionSelectContact(contactnumber, contactname) {
    console.log(contactnumber, contactname, this.selectContacts);
  }
  loginPage() {
    this.router.navigate(['/signin']);
  }
  allClicked() {
    this.contactList.filter((data) => {
      this.contactList.push(data.studentName);
    });
  }
  getContacts(): void {
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
  }

  addContact(): void {
    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, 'Smith', 'John');
    let number = new ContactField('mobile', '6471234567');
    contact.phoneNumbers = [number];
    contact.save().then(
      () => console.log('Contact saved!', contact),
      (error: any) => console.error('Error saving contact.', error)
    );
  }

  ionViewWillEnter() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(success => {
      console.log('Permiso concebido.');
    }, err => {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS);
    });
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }



  onClickSMSList() {
    console.log("onClickSMSList");
    this.countNewSMSs = 0;
    //this.router.
    this.navCtrl.navigateForward('/list');
  }

  readListSMS() {
    console.log("readListSMS.");
    let filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft' 
      indexFrom: 0, // Start from index 0.
      maxCount: 20, // Count of SMS to return each time.
    };
    return new Promise((resolve, reject) => {
      if (SMS) SMS.listSMS(filter, (listSMS) => {
        console.log("SMS", listSMS);

        resolve(listSMS);
      }, Error => {
        console.log('Error list sms:' + Error);
        reject(Error);
      });
    });
  }


  /*
  sendTextMessage(number, message) {
    console.log("Number: " + number);
    console.log("Message: " + message);
    this.sms.send(number, message).then((result) => {
      let successToast = this.toastCtrl.create({
        message: "Text message sent successfully! :)",
        duration: 3000
      })
      successToast.present();
    }, (error) => {
      let errorToast = this.toastCtrl.create({
        message: "Text message not sent. :(",
        duration: 3000
      })
      errorToast.present();
    });
 }
 */
  ionViewDidLoad() {
    console.log('ionViewDidLoad SmsListPage');

    this.readListSMS2();
  }
  addInfo() {
    this.router.navigate(['/add-info']);
  }
  detail(key) {
    this.router.navigate(['/detail/' + key]);
  }
  edit(key) {
    this.router.navigate(['/edit/' + key]);
  }
  async delete(key) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure want to delete this info?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            firebase.database().ref('infos/' + key).remove();
          }
        }
      ]
    });

    await alert.present();
  }

  // List page data



  readListSMS2() {

    let loading = this.loadingCtrl.create({
      message: "Loading SMS...",
      duration: 2000
    });
    console.log("1");
    this.readListSMS1()
      .then(listSMS => {
        //console.log(listSMS);
        this.results = listSMS;
        this.groupMessabesByAddress();


      })
  }

  selectedMessage(message) {
    //console.log(message);
    //this.router.navigate('/SmsDetailsPage',{message: message});
    //this.navCtrl.push(SmsDetailsPage, {  message: message});
    this.router.navigate(['/detail', { message: JSON.stringify(message) }]);

  }

  groupMessabesByAddress() {
    let messages = this.results;
    let res = messages.reduce(function (res, currentValue) {
      if (res.indexOf(currentValue.address) === -1) {
        res.push(currentValue.address);
      }
      //console.log(res);
      return res;
    }, []).map(function (address) {
      return {
        address: address,
        info: messages.filter(function (_el) {
          return _el.address === address;
        }).map(function (_el) { return _el; })
      }
    });

    console.log(res);
    this.messages = res;
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }

  showAlert() {
    alert("To test the APP use a mobile device.");
  }

  sendTextMessage() {
    // Using nativa ionic SMS.
    //this.smsService.sendTextMessage(this.text.number, this.text.message);
    // Using cordova-sms-plugin.
    //this.sendSMS(this.text.number, this.text.message);
    if (this.platform.is('cordova')) {
      this.sqlite.create({
        name: 'autoresponse.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("INSERT INTO response(id, message,contacts, starttime, endtime, date) VALUES (?,?,?,?,?,?);", [null, this.myresponse, this.selectContacts, this.starttime, this.endtime, this.date]).then((data) => {
          console.log('Executed SQL data inserted');
        }).catch(e => console.log(e));
      }).catch(e => console.log(e));
    };
  }


  onChangePhone() {
    console.log(this.text.number);
  }

  onClickMessage() {
    //console.log("onClickMessage");
    this.text.number = this.text.number.replace("_", "");
    //console.log(this.text.number);
  }

  sendSMS(number, message) {
    /*
    SMS.sendSMS(number, message => { 
      console.log("SMS sent."); 
    },Error => { 
      console.log('Error sending SMS.'); 
    });
    */

    SMS.sendSMS(number, message, function () {
      console.log("SMS sent.");
    }, function (e) {
      console.log('Error sending SMS.');
    });
  }

  readListSMS1() {
    console.log("readListSMS.");
    let filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft' 
      indexFrom: 0, // Start from index 0.
      maxCount: 20, // Count of SMS to return each time.
    };
    return new Promise((resolve, reject) => {
      if (SMS) SMS.listSMS(filter, (listSMS) => {
        console.log("SMS", listSMS);
        //let newInfo = firebase.database().ref('infos/').push();
        //newInfo.set(listSMS);
        resolve(listSMS);
      }, Error => {
        console.log('Error list sms:' + Error);
        reject(Error);
      });
    });
  }

  waitingForSMS() {
    console.log("1");
    return new Promise((resolve, reject) => {
      if (SMS) SMS.startWatch(() => {
        console.log('Waiting for SMS...inside');
        this.ionViewDidLoad();
      }, Error => {
        console.log('Error waiting for SMS.');
        console.log("2", Error);
      });
      document.addEventListener('onSMSArrive', (e: any) => {
        console.log("3");
        var sms = e.data;
        console.log({ mensaje_entrante: sms }, sms, "4");
        this.events.publish('onSMSArrive', sms);

        let newInfo = firebase.database().ref('infos/').push();
        newInfo.set(sms);

        let messageDetail: string = "";

        if (this.platform.is('cordova')) {
          this.sqlite.create({
            name: 'autoresponse.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql("select * from response;", []).then((data) => {
              console.log(data);
              console.log('Executed SQL data response');
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                  console.log(data.rows.item(i).id);
                  console.log(data.rows.item(i).message);
                  console.log(data.rows.item(i).contacts);
                  console.log(data.rows.item(i).starttime);
                  console.log(data.rows.item(i).endtime);
                  console.log(data.rows.item(i).date);
                  this.setedResponse.push({ id: data.rows.item(i).id, message: data.rows.item(i).message, contacts: data.rows.item(i).contacts, starttime: data.rows.item(i).starttime, endtime: data.rows.item(i).endtime, date: data.rows.item(i).date });
                }
              }
            }).catch(e => console.log(e));
          }).catch(e => console.log(e));
        };

        console.log('sabh kujh ete athae pyara hite hite dis cha tho print thae', sms, sms.address, Number(sms.address));
        for (let ms of this.setedResponse) {
          messageDetail = ms.message;
        }
        this.sendSMS(sms.address, messageDetail);


        resolve(sms);
      });
    });
  }

  // waitingForSMS() {
  //   console.log("waitingForSMS");
  //   return new Promise((resolve, reject) => {
  //     if (SMS) SMS.startWatch(() => {
  //       console.log('Waiting for SMS...');
  //     }, Error => {
  //       console.log('Error waiting for SMS.');
  //     });
  //     document.addEventListener('onSMSArrive', (e: any) => {
  //       var sms = e.data;
  //       console.log({ mensaje_entrante: sms });
  //       this.events.publish('onSMSArrive', sms);
  //       resolve(sms);
  //     });
  //   });
  // }

  /*
  sendTextMessage(number, message) {
    console.log("Number: " + number);
    console.log("Message: " + message);
    this.sms.send(number, message).then((result) => {
      let successToast = this.toastCtrl.create({
        message: "Text message sent successfully! :)",
        duration: 3000
      })
      successToast.present();
    }, (error) => {
      let errorToast = this.toastCtrl.create({
        message: "Text message not sent. :(",
        duration: 3000
      })
      errorToast.present();
    });
 }
 */

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};