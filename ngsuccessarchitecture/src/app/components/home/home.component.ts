import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ENGLISH: boolean;
  ARABIC: boolean;
  userlanguage: string = undefined;
  userrole: string = undefined;
  username: string = undefined;
  realname: string = undefined;
  USER: boolean;
  ADMIN: boolean;
  CUSTOMER: boolean;
  subscription: Subscription;

  constructor(private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.authService.loadUserLanguage();
    this.subscription = this.authService.getUserlanguage()
      .subscribe(
        lang => {
          console.log('home lang ', lang);
            this.userlanguage = lang;
          if (this.userlanguage === 'english') {
            this.ENGLISH = true;
            this.ARABIC = false;
          } else if (this.userlanguage === 'arabic') {
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

}
