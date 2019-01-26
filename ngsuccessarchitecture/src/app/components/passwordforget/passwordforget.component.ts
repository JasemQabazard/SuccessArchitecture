import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { CommonRoutinesService } from '../../services/common-routines.service';

@Component({
  selector: 'app-passwordforget',
  templateUrl: './passwordforget.component.html',
  styleUrls: ['./passwordforget.component.css']
})
export class PasswordforgetComponent implements OnInit {
  fe: FormGroup;
  fv: FormGroup;
  fp: FormGroup;
  message: string;
  messageClass: string;
  processing = false;
  verifycode: string = this.commonRoutinesService.codeGen();
  timeleft: number;
  showverifyemail = false;
  showPasswordForm = false;
  user = {email: '', password: ''};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonRoutinesService: CommonRoutinesService,
    private router: Router
  ) {
    this.createFE();
    this.createFV();
    this.createFP();
  }

  ngOnInit() {
  }

  createFE() {
    this.fe = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // Custom validation
      ])]
    });
  }

  createFP() {
    this.fp = this.formBuilder.group(
      {
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          this.validatePassword
        ])]
      }
    );
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

    passwordForgetSubmit() {
      this.processing = true;
      this.disableFE();
      this.authService.checkEmail(this.fe.get('email').value).subscribe(
        data => {
          // Check if success true or false was returned from API
          // the logic is reversed here since I am using the same routine for
          // registration email check. here its important that email exists on file
          // the opposite is true for a new registration
          if (data.success) {
            this.message = 'email does not exist on file';
            this.messageClass = 'alert alert-danger';
            this.processing = false;
            // fe is not processing since email not on file allow user to input the correct email id to be verified
            this.enableFE();
          } else {
            this.message = null;
            this.messageClass = '';
            this.processing = true; // Return email as valid since it exists on file
            this.disableFE();
            this.sendVerifyEmail();
          }
        },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
        }
      );
    }

  sendVerifyEmail() {
    const codeData = {
      email: '',
      vcode: ''
    };
    codeData.email = this.fe.get('email').value;
    codeData.vcode = this.verifycode;
    console.log(codeData);
    this.authService.forgetPasswordVerification(codeData).subscribe(
      data => {
        this.message = null;
        this.processing = true;
        this.disableFE();
        this.showverifyemail = true;
        this.timeleft = 90;
        const x = setInterval(() => {
                --this.timeleft;
                if (this.timeleft === 0) {
                  clearInterval(x);
                  this.processing = false;
                  this.showverifyemail = false;
                  this.enableFE();
                }
              }, 1000);
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  enableFE() {
    this.fe.controls['email'].enable();
  }

  disableFE() {
    this.fe.controls['email'].disable();
  }

  onVerifyClick() {
    this.showverifyemail = false;
    this.showPasswordForm = true;
  }

  passwordResetSubmit() {
    this.user.email = this.fe.get('email').value;
    this.user.password = this.fp.get('password').value;
    this.authService.passwordReset(this.user).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'Password Reset Successfull';
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to Login page
        }, 1000);
    },
      error => {
        this.messageClass = 'alert alert-danger';
        this.message = error;
      }
    );
  }

}
