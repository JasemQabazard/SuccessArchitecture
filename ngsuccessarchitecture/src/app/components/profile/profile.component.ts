import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { AuthService } from '../../services/auth.service';
import { User, Codes } from '../../shared/security';
import { CommonRoutinesService } from '../../services/common-routines.service';

import { Subscription } from 'rxjs';

import { awsMediaPath } from '../../shared/blog';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  subscription: Subscription;
  fu: FormGroup;  // initial user input form control
  fv: FormGroup;
  user: User;
  codes: Codes[];
  username: string = undefined;
  existingEmail = '';
  message: string;
  messageClass: string;
  emailValid = true;
  emailMessage: string;
  mobileValid = true;
  mobileMessage: string;
  notUpdated = false;
  _uid = '';
  selectedImageFile: File = null;
  selectedImageFileName = 'No New Image Selected';
  avatarPath = '../../../assets/images/avatardefault.png';
  avatarChanged = false;
  timeleft: number;
  showverifyemail = false;
  processing = false;
  verifycode: string = this.commonRoutinesService.codeGen();
  start: Date = new Date();
  max: Date = new Date(this.start.getFullYear() - 10, this.start.getMonth(), this.start.getDate(), 0, 0, 0);
  min: Date = new Date(this.start.getFullYear() - 100, this.start.getMonth(), this.start.getDate(), 0, 0, 0);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonRoutinesService: CommonRoutinesService,
    private blogService: BlogService,
    private router: Router,
    @Inject('BaseURL') private BaseURL
  ) {
    this.datePickerConfig = Object.assign( {},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        minDate: this.min,
        maxDate: this.max,
        dateInputFormat: 'DD/MM/YYYY'
      });
    this.createfu();
    this.createfv();
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
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        this.username = name;
        this.authService.getUser(this.username)
        .subscribe(user => {
          this.user = user;
          console.log('user : ', this.user);
          this._uid = user._id;
          if (user.avatar) {
            this.avatarPath = awsMediaPath + user.avatar;
            this.selectedImageFileName = 'Image Selected from file';
          }
          this.fu.setValue({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            countrycode: user.countrycode,
            mobile: user.mobile,
            birthdate: new Date(user.birthdate)
          });
          this.notUpdated = true;
          this.existingEmail = user.email;
        },
          errmess => {
            console.log('error : ', errmess);
        });
    });
  }

  createfv() {
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

  createfu() {
    this.fu = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // Custom validation
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
    this.onChanges();
  }

  onChanges(): void {
    this.fu.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
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

  // Function to check if e-mail is taken
  checkEmail() {
    // Function from authentication file to check if e-mail is taken
    if (this.fu.get('email').value === '' ||
            this.fu.get('email').value === this.existingEmail) { return; }
    this.emailValid = false;
    this.authService.checkEmail(this.fu.get('email').value).subscribe(
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
  // Function to check if mobile number is not previously used  is unique
  checkMobile() {
    // Function from authentication file to check if username is taken
    if (this.fu.get('mobile').value === '') { return; }
    this.authService.checkMobile(this.fu.get('mobile').value).subscribe(
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

  imageFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImageFile = event.target.files[0];
      this.displayMediaFile();
    }
  }

  displayMediaFile() {
    this.avatarChanged = true;
    this.notUpdated = false;
    this.selectedImageFileName = `Selected Image: ${this.selectedImageFile.name}`;
    function imageExists(url, callback) {
      const img = new Image();
      img.onload = function() { callback(true); };
      img.onerror = function() { callback(false); };
      img.src = url;
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
      imageExists(event.target.result, (exists) => {
        if (exists) {
          this.avatarPath = event.target.result;
        } else {
          this.selectedImageFileName = 'Your selection is not an Image File';
          this.avatarPath = '../../../assets/img/avatardefault.png';
        }
      });
    };
    reader.readAsDataURL(this.selectedImageFile);
  }

    onUpdateSubmit() {
      if (this.existingEmail === this.fu.get('email').value) {
              this.onVerifyClick();
      } else {
        const codeData = {
          email: '',
          vcode: ''
        };
        codeData.email = this.fu.get('email').value;
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
            this.message = <any>errormessage;
            this.messageClass = 'alert alert-danger';
          }
        );
      }
    }

    onVerifyClick() {
      this.enableForm();
      this.user = this.fu.value;
      console.log('onVerifyClick user ', this.user);
      if (this.avatarChanged) {
        const fileext = this.selectedImageFile.type.slice(this.selectedImageFile.type.indexOf('/') + 1);
        const specs = this._uid + fileext;
        this.blogService.postAWSMediaURL(specs)
                  .subscribe(uploadConfig => {
                    this.blogService.putAWSMedia(uploadConfig.url , this.selectedImageFile)
                    .subscribe(resp => {
                      this.avatarPath = awsMediaPath + uploadConfig.key;
                      this.user.avatar = uploadConfig.key;
                      this.selectedImageFileName = '';
                      this.avatarChanged = false;
                      this.userDataBaseChange();
                    },
                    errormessage => {
                      this.message = errormessage;
                      this.messageClass = 'alert alert-danger';
                    });
            });
      } else {
        this.userDataBaseChange();
      }
    }

    userDataBaseChange() {
      this.authService.updateUser(this._uid, this.user).subscribe(
        data => {
          console.log('update data : ', data);
          this.messageClass = 'alert alert-success';
          this.message = 'User Data Update Successfull';
          setTimeout(() => {
            this.router.navigate(['/']);
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
      this.fu.controls['email'].enable();
      this.fu.controls['firstname'].enable();
      this.fu.controls['lastname'].enable();
      this.fu.controls['countrycode'].enable();
      this.fu.controls['mobile'].enable();
      this.fu.controls['birthdate'].enable();
    }

    disableForm() {
      this.fu.controls['email'].disable();
      this.fu.controls['firstname'].disable();
      this.fu.controls['lastname'].disable();
      this.fu.controls['countrycode'].disable();
      this.fu.controls['mobile'].disable();
      this.fu.controls['birthdate'].disable();
    }

}
