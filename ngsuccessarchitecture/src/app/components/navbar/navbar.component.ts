import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  ADMIN = false;
  USER = true;
  CUSTOMER = false;
  realname: string = undefined;
  userlanguage: string = undefined;
  userrole: string = undefined;
  username: string = undefined;
  subscription: Subscription;
  ENGLISH: boolean;
  ARABIC: boolean;

  constructor(private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.authService.loadUserLanguage();
    this.subscription = this.authService.getUserlanguage()
      .subscribe(
        lang => {
          this.userlanguage = lang;
          if (lang === 'english') {
            this.USER = true;
            this.ADMIN = false;
            this.CUSTOMER = false;
            this.ENGLISH = true;
            this.ARABIC = false;
            // tslint:disable-next-line:max-line-length
            console.log('lang this.userlanguage this.USER this.ADMIN this.CUSTOMER', lang, this.userlanguage, this.USER, this.ADMIN, this.CUSTOMER);
          } else {
            this.ARABIC = true;
            this.ENGLISH = false;
          }
        });
      this.authService.loadUserCredentials();
      this.subscription = this.authService.getUserrole()
      .subscribe(
        role => {
          this.userrole = role;
          if (role === undefined) {
            this.USER = true;
            this.CUSTOMER = false;
            this.ADMIN = false;
          } else if (role === 'CUSTOMER') {
            this.USER = false;
            this.CUSTOMER = true;
            this.ADMIN = false;
          } else if (role === 'ADMIN') {
            this.ADMIN = true;
            this.USER = false;
            this.CUSTOMER = false;
          }
          // tslint:disable-next-line:max-line-length
          console.log('role this.USER this.ADMIN this.CUSTOMER', role, this.USER, this.ADMIN, this.CUSTOMER);
        });
        this.subscription = this.authService.getRealname()
        .subscribe(
          realname => {
            this.realname = realname;
            console.log('realname ', realname);
          });
        this.subscription = this.authService.getUsername()
        .subscribe(
          username => {
            this.username = username;
            console.log('username ', username);
          });
  }

  logOut() {
    this.authService.logOut();
  }
  arabic() {
    this.authService.storeUserLanguage('arabic');
  }
  english() {
    this.authService.storeUserLanguage('english');
  }

}
