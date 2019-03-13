import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  constructor(public router: Router) {

  }

  ngOnInit() {
  }
  userHome() {
    this.router.navigate(['/userhome']);
  }
  userSignUp(){
    this.router.navigate(['/signup']);
  }
  forgotPassword(){

  }
}
