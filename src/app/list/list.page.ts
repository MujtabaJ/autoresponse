import { Component, OnInit } from '@angular/core';
import { NavController,  Events, LoadingController } from '@ionic/angular';

import { Router } from '@angular/router';

declare var SMS: any;

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
 
  messages: any;
  results: any;
  //router:Router;
  isApp: boolean;
  masks: any;

  text = {
    "number": "",
    "message": "",
  };

  countNewSMSs = 0;
  
  constructor(public navCtrl: NavController, public router: Router,
    public loadingCtrl: LoadingController, public events: Events) {
      this.results = [];
      this.messages = [];

      console.log("1");
      events.subscribe('onSMSArrive', (sms) => {
        // Sms is the same argument passed in `events.publish(sms)`.
        console.log('onSMSArrive', sms);
        
        this.readListSMS();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SmsListPage');

    this.readListSMS();
  }

  readListSMS() {

    let loading = this.loadingCtrl.create({
      message: "Loading SMS...",
      duration:2000
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
    this.router.navigate(['/detail', { id: message }]);
  }

  groupMessabesByAddress() {
    let messages = this.results;
    let res = messages.reduce(function(res, currentValue) {
      if (res.indexOf(currentValue.address) === -1 ) {
        res.push(currentValue.address);
      }
      //console.log(res);
      return res;
    }, []).map(function(address) {
      return {
        address: address,
        info: messages.filter(function(_el) {
          return _el.address === address;
        }).map(function(_el) { return _el; })
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
    this.sendSMS(this.text.number, this.text.message);
  }

  onClickSMSList() {
    //console.log("onClickSMSList");
    this.countNewSMSs = 0;
    //this.router.
    this.navCtrl.navigateForward('/list');
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

    SMS.sendSMS(number, message,function(){
      console.log("SMS sent."); 
     }, function(e){
      console.log('Error sending SMS.'); 
     });
  }
  
  readListSMS1() {  
    console.log("readListSMS."); 
    let filter = { 
      box : 'inbox' , // 'inbox' (default), 'sent', 'draft' 
      indexFrom : 0 , // Start from index 0.
      maxCount : 20 , // Count of SMS to return each time.
    }; 
    return new Promise((resolve, reject) => {
      if (SMS)SMS.listSMS(filter,(listSMS) => { 
        console.log("SMS" , listSMS); 
        resolve(listSMS);
      },Error => { 
        console.log('Error list sms:' + Error); 
        reject(Error);
      }); 
    });
  } 
    
  waitingForSMS() {
    console.log("waitingForSMS");
    return new Promise((resolve, reject) => {
      if (SMS)SMS.startWatch(() => { 
        console.log('Waiting for SMS...'); 
      },Error => { 
        console.log('Error waiting for SMS.'); 
      });      
      document.addEventListener('onSMSArrive', (e: any ) => { 
        var sms = e.data; 
        console.log({mensaje_entrante:sms});    
        this.events.publish('onSMSArrive', sms);   
        resolve(sms);
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

}
