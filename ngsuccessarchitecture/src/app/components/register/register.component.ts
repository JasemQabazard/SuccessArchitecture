import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { AuthService } from '../../services/auth.service';
import { CommonRoutinesService } from '../../services/common-routines.service';
import { User, Codes } from '../../shared/security';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  fr: FormGroup;
  fv: FormGroup;
  codes: Codes[];
  user: User;
  message: string;
  messageClass: string;
  emailValid = false;
  emailMessage: string;
  usernameValid = false;
  usernameMessage: string;
  mobileValid = false;
  mobileMessage: string;
  timeleft: number;
  showverifyemail = false;
  processing = false;
  verifycode: string = this.commonRoutinesService.codeGen();
  ENGLISH = true;
  ARABIC = false;
  start: Date = new Date();
  max: Date = new Date(this.start.getFullYear() - 10, this.start.getMonth(), this.start.getDate(), 0, 0, 0);
  min: Date = new Date(this.start.getFullYear() - 100, this.start.getMonth(), this.start.getDate(), 0, 0, 0);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonRoutinesService: CommonRoutinesService,
    private router: Router,
    @Inject('BaseURL') private BaseURL
  ) {
    console.log(this.min, this.max);
    this.datePickerConfig = Object.assign( {},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        minDate: this.min,
        maxDate: this.max,
        dateInputFormat: 'DD/MM/YYYY'
      });
    this.createFR();
    this.createFV();
   }

  ngOnInit() {
    this.codes = [
      {countryCode: '+973 Bahrain'},
      {countryCode: '+966 KSA'},
      {countryCode: '+965 Kuwait'},
      {countryCode: '+968 Oman'},
      {countryCode: '+974 Qatar'},
      {countryCode: '+66 Thailand'},
      {countryCode: '+971 UAE'},
      {countryCode: '+1 USA'}
    ];
  }

  createFV() {
    this.fv = this.formBuilder.group({
      verifyInput: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)])]
      }, {
        validator: this.emailVerification(this.verifycode, 'verifyInput')
      }
    );
  }

  emailVerification(vcode, verifyInput) {
    console.log(vcode, verifyInput);
    return (group: FormGroup) => {
      if (vcode === group.controls[verifyInput].value) {
        return null; // Return as valid Verification Code { 'emailVerification': false }
      } else {
        return { 'emailVerification': true }; // Return as invalid Verification Code
      }
    };
  }

  createFR() {
    this.fr = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // Custom validation
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      firstname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        this.validateName
      ])],
      lastname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        this.validateName
      ])],
      countrycode: '+965 Kuwait',
      mobile: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        this.validateMobile
      ])],
      birthdate: ''
    });
  }

    // Function to validate e-mail is proper format
  validateEmail(controls) {
    // Create a regular expression
    // tslint:disable-next-line:max-line-length
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true }; // Return as invalid email
    }
  }

      // Function to validate username is proper format
  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true }; // Return as invalid username
    }
  }

  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    // const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true }; // Return as invalid password
    }
  }

  // Function to validate name is proper format
  validateName(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z '.-]*$/);
    // Test name against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid name
    } else {
      return { 'validateName': true }; // Return as invalid name
    }
  }

  // Function to validate name is proper format
  validateMobile(controls) {
    // Create a regular expression
  const regExp = new RegExp(/^(?:[1-9]\d*|\d)$/);
    // Test phone against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid phone
    } else {
      return { 'validateMobile': true }; // Return as invalid Mobile
    }
  }

  onRegisterSubmit() {
    const codeData = {
      email: '',
      vcode: ''
    };
    codeData.email = this.fr.get('email').value;
    codeData.vcode = this.verifycode;
    this.authService.mailVerification(codeData).subscribe(
      data => {
        this.processing = true;
        this.disableForm();
        this.showverifyemail = true;
        this.timeleft = 90;
        const x = setInterval(() => {
                --this.timeleft;
                if (this.timeleft === 0) {
                  clearInterval(x);
                  this.processing = false;
                  this.showverifyemail = false;
                  this.enableForm();
                }
              }, 1000);
      },
      errormessage => {
        this.message = 'OPPS! error please try later! Thank You';
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  onVerifyClick() {
    this.enableForm();
    this.user = this.fr.value;
    const codeData = {
      email: this.user.email,
      name: this.user.firstname + ' ' + this.user.lastname,
      username: this.user.username,
      password: this.user.password
    };
    this.authService.registerUser(this.user).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'User Log Successfull';
        this.fr.reset();
        this.fr.controls['countrycode'].setValue('+965 Kuwait');
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login page
        }, 1500);
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
        this.processing = false;
        this.showverifyemail = false;
      }
    );
  }

  enableForm() {
    this.fr.controls['username'].enable();
    this.fr.controls['password'].enable();
    this.fr.controls['email'].enable();
    this.fr.controls['firstname'].enable();
    this.fr.controls['lastname'].enable();
    this.fr.controls['countrycode'].enable();
    this.fr.controls['mobile'].enable();
    this.fr.controls['birthdate'].enable();
  }

  disableForm() {
    this.fr.controls['username'].disable();
    this.fr.controls['password'].disable();
    this.fr.controls['email'].disable();
    this.fr.controls['firstname'].disable();
    this.fr.controls['lastname'].disable();
    this.fr.controls['countrycode'].disable();
    this.fr.controls['mobile'].disable();
    this.fr.controls['birthdate'].disable();
  }


  // Function to check if e-mail is taken
  checkEmail() {
    // Function from authentication file to check if e-mail is taken
    if (this.fr.get('email').value === '') { return; }
    this.authService.checkEmail(this.fr.get('email').value).subscribe(
      data => {
        // Check if success true or false was returned from API
        if (!data.success) {
          this.emailValid = false; // Return email as invalid
          this.emailMessage = data.message; // Return error message
        } else {
          this.emailValid = true; // Return email as valid
        }
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  // Function to check if username is available
  checkUsername() {
    // Function from authentication file to check if username is taken
    console.log('USERNAME : ', this.fr.get('username').value);
    if (this.fr.get('username').value === '') { return; }
    this.authService.checkUsername(this.fr.get('username').value).subscribe(
      data => {
      // Check if success true or success false was returned from API
        if (!data.success) {
          this.usernameValid = false; // Return username as invalid
          this.usernameMessage = data.message; // Return error message
        } else {
          this.usernameValid = true; // Return username as valid
        }
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  // Function to check if mobile number is not previously used  is unique
  checkMobile() {
    // Function from authentication file to check if username is taken
    if (this.fr.get('mobile').value === '') { return; }
    this.authService.checkMobile(this.fr.get('mobile').value).subscribe(
      user => {
      // Check user exists then mobile is used already
        if (user) {
          this.mobileValid = false; // Return mobile as invalid
          this.mobileMessage = 'user mobile number already in system. Please enter another mobile';
        } else {
          this.mobileValid = true; // Return mobile as valid
        }
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
  }

}
