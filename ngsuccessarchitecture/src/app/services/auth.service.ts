import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userlanguage: Subject<string> = new BehaviorSubject<string>('');

  constructor() { }

  loadUserCredentials() {
    this.sendUserlanguage('english');
  }

  sendUserlanguage(lang: string) {
    this.userlanguage.next(lang);
  }

  getUserlanguage(): Observable<string> {
    return this.userlanguage.asObservable();
  }

  clearUserlanguage() {
    this.userlanguage.next(undefined);
  }
}
