import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-homestudy',
  templateUrl: './homestudy.component.html',
  styleUrls: ['./homestudy.component.css']
})
export class HomestudyComponent implements OnInit {
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
    private router: Router) { }

  ngOnInit() {
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
  }

}
