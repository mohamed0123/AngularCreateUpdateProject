import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  topicHasError;
  errorMsg;
  userNameTs;
  passwrordTs;
  submitted;
  @Output()
  isAuthorized = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSubmit(){
    debugger
    console.table({'user name':this.userNameTs , 'password':this.passwrordTs })
    this.isAuthorized.emit(true);
  }
}
