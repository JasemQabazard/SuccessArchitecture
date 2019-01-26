import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../shared/security';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { baseURL } from '../shared/baseurl';

interface AuthResponse {
  status: string;
  success: string;
  token: string;
  realname: string;
  role: string;
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userlanguage: Subject<string> = new BehaviorSubject<string>('');
  tokenKey: string;
  languageKey: string;
  isAuthenticated: Boolean;
  username: Subject<string> = new BehaviorSubject<string>('');
  authToken: string;
  realname: Subject<string> = new BehaviorSubject<string>('');
  userrole: Subject<string> = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) {
    this.tokenKey = 'SAJWT';
    this.languageKey = 'lang';
    this.authToken = undefined;
    this.isAuthenticated = false;
   }

     // main user registration communication with the server
  registerUser(user: any): Observable<any> {
    return this.http.post(baseURL + '/users/register', user)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  // send email to successarchitecture@gmail.com from user in contact support type environment
  contactSupport(contact) {
    return this.http.post(baseURL + '/contact/', contact)
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // emails verification code to user email used in registration and lost password recovery
  mailVerification(codeData) {
    return this.http.post(baseURL + '/users/mailer', codeData)
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // MADD mailer to user email with registration data
  maddmailer(mailerBody) {
    return this.http.post(baseURL + '/users/maddmailer', mailerBody)
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // Function to check if username is taken, used in registration
  checkUsername(username): Observable<any> {
    return this.http.get(baseURL + '/users/checkUsername/' + username)
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // Functions to get/ update user using username, used in useramend.component.ts user date Update
  // and group
  getUser(username): Observable<any> {
    return this.http.get(baseURL + '/users/userUpdate/' + username)
    .catch(error => this.processHttpmsgService.handleError(error));
  }
  updateUser(uid: string, user: any) {
    return this.http.put(baseURL + '/users/' + uid , user)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  // Function to check if e-mail is taken, used in registration
  checkEmail(email): Observable<any> {
    return this.http.get(baseURL + '/users/checkEmail/' + email)
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // Function to check if mobile is already in data base, used in registration
  checkMobile(mobile): Observable<any> {
    return this.http.get(baseURL + '/users/getUserbymobile/' + mobile)
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // emails verification code to user email used in forget/lost password recovery
  forgetPasswordVerification(codeData) {
    return this.http.post(baseURL + '/users/passwordcodemailer', codeData)
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // Function to RESET THE PASSWORD  FOR THE USER
  passwordReset(user): Observable<any> {
    return this.http.post(baseURL + '/users/passwordreset', user)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + '/users/checkJWTtoken')
    .subscribe(res => {
      console.log('JWT Token Valid: ', res);
      this.sendUsername(res.user.username);
      this.sendUserrole(res.user.role);
      this.sendRealname(res.user.firstname + ' ' + res.user.lastname);
    },
    err => {
      console.log('JWT Token invalid: ', err);
      this.destroyUserCredentials();
    });
  }

  loadUserLanguage() {
    const userlanguage = JSON.parse(localStorage.getItem(this.languageKey));
    console.log('loadUserLanguage ', userlanguage);
    if (userlanguage !== null) {
      this.sendUserlanguage(userlanguage);
    } else {
      this.storeUserLanguage('english');
    }
  }

  storeUserLanguage(lang: any) {
    console.log('storeUserLanguage ', lang);
    localStorage.setItem(this.languageKey, JSON.stringify(lang));
    this.sendUserlanguage(lang);
  }

  loadUserCredentials() {
    const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    console.log('loadUserCredentials ', credentials);
    if (credentials && credentials.username !== undefined) {
      this.useCredentials(credentials);
      if (this.authToken) {
        this.checkJWTtoken();
      }
    }
  }

  storeUserCredentials(credentials: any) {
    console.log('storeUserCredentials ', credentials);
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.sendUsername(credentials.username);
    this.sendRealname(credentials.realname);
    this.authToken = credentials.token;
    this.sendUserrole(credentials.userrole);
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.clearRealname();
    this.clearUserrole();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  logIn(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + '/users/login',
    {'username': user.username, 'password': user.password})
      .map(res => {
          // tslint:disable-next-line:max-line-length
          this.storeUserCredentials({username: user.username, token: res.token, realname: res.realname, userrole: res.role});
          return {'success': true, 'username': user.username };
      })
        .catch(error => this.processHttpmsgService.handleError(error));
  }

    // Function to CHANGE THE PASSWORD  FOR THE USER
    passwordChange(user): Observable<any> {
      return this.http.post(baseURL + '/users/passwordchange', user)
        .catch(error => this.processHttpmsgService.handleError(error));
    }

    // Function to check if old password supplied in the change password form is equal to the existing password
    checkOldPassword(user: any): Observable<any> {
      return this.http.post(baseURL + '/users/checkOldPassword',
      {'username': user.username, 'password': user.password})
      .catch(error => this.processHttpmsgService.handleError(error));
    }

  logOut() {
    this.destroyUserCredentials();
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
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

  sendUsername(name: string) {
    this.username.next(name);
  }
  getUsername(): Observable<string> {
    return this.username.asObservable();
  }
  clearUsername() {
    this.username.next(undefined);
  }

  sendRealname(Rname: string) {
    this.realname.next(Rname);
  }
  getRealname(): Observable<string> {
    return this.realname.asObservable();
  }
  clearRealname() {
    this.realname.next(undefined);
  }

  sendUserrole(role: string) {
    this.userrole.next(role);
  }
  getUserrole(): Observable<string> {
    return this.userrole.asObservable();
  }
  clearUserrole() {
    this.userrole.next(undefined);
  }

  getToken(): string {
    return this.authToken;
  }

}
