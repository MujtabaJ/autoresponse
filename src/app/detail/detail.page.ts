import { Component, OnInit } from '@angular/core';

import * as firebase from 'Firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  private sub: any;
  messages: any = [];
  //infos = [];
  //ref = firebase.database().ref('infos/');

  constructor(public navCtrl: NavController, private route: ActivatedRoute,private thisRoute:ActivatedRoute) {
    //this.messages =  this.route.snapshot.params['id'];
    // this.sub = this.route.params.subscribe(params => {
    //   this.messages = +params['message']; // (+) converts string 'id' to a number
    //   console.log(this.messages);
    //   // In a real app: dispatch action to load the details here.
    // });

    let msg = this.thisRoute.snapshot.paramMap.get('message');
    this.messages = JSON.parse(msg); 
    console.log(JSON.parse(msg), this.messages);
    //console.log('constructor SmsDetailsPage');
    //console.log(this.messages);
    this.groupMessabesByDate();
    this.removeDuplicates();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SmsDetailsPage');
  }

  groupMessabesByDate() {
    let messages = this.messages.info;
    //console.log("groupMessagesByDate");
    //console.log(messages);
    let res = messages.reduce(function (res, currentValue) {
      if (res.indexOf(currentValue.date) === -1) {
        res.push(currentValue.date);
      }
      //console.log(res);
      return res;
    }, []).map(function (date) {
      return {
        date: moment(date).format("DD/MM/YYYY"),
        info: messages.filter(function (_el) {
          return moment(_el.date).isSame(moment(date), 'day');
        }).map(function (_el) { return _el; })
      }
    });

    //console.log(res);
    this.messages = res;
  }

  removeDuplicates() {
    let noDupeObj = {} //Create an associative array. It will not accept duplicate keys.
    for (let i = 0, n = this.messages.length; i < n; i++) {
      //Store each object as a variable. This helps with clarity in the next line.
      var item = this.messages[i];
      // This is the critical step.
      // Here, you create an object within the associative array that has a key composed of the two values 
      // from the original object. 
      // Since the associative array will not allow duplicate keys, and the keys are determined by the 
      // content, then all duplicate content are removed. 
      // The value assigned to each key is the original object which is along for the ride and used 
      // to reconstruct the list in the next step.
      noDupeObj[item.date] = item;
    }

    //Recontructs the list with only the unique objects left in the doDupeObj associative array.
    let index = 0;
    let uniqueMessages = [];
    for (let item in noDupeObj) {
      uniqueMessages[index++] = noDupeObj[item]; //Populate the array with the values from the noDupeObj.
    }

    this.messages = uniqueMessages;
    //console.log(this.messages);
  }

  ngOnInit() {
  }


}
export const snapshotToObject = snapshot => {
  let item = snapshot.val();
  item.key = snapshot.key;

  return item;
}
