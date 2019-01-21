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
  USER = false;
  realname = 'Jasem Qabazard';
  ADMIN = false;
  userlanguage: string = undefined;
  subscription: Subscription;

  constructor(private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUserlanguage()
      .subscribe(
        lang => {
          this.userlanguage = lang;
        });
  }

  logOut() {
    console.log('logging out of sa');
  }
  arabic() {
    this.authService.sendUserlanguage('arabic');
  }
  english() {
    this.authService.sendUserlanguage('english');
  }

}
