import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  USER = false;
  realname = 'Jasem Qabazard';
  ADMIN = false;

  constructor() { }

  ngOnInit() {
  }

  logOut() {
    console.log('logging out of sa');
  }

}
