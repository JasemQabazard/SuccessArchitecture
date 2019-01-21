import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  ENGLISH: boolean;
  ARABIC: boolean;
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
          if (this.userlanguage === 'english') {
            this.ENGLISH = true;
            this.ARABIC = false;
          } else if (this.userlanguage === 'arabic') {
            this.ARABIC = true;
            this.ENGLISH = false;
          }
        });
  }

}
