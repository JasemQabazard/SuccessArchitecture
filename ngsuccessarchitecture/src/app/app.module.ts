import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { CommonRoutinesService } from './services/common-routines.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { baseURL } from './shared/baseurl';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BlogComponent } from './components/blog/blog.component';
import { HomeComponent } from './components/home/home.component';
import { MarketComponent } from './components/market/market.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';
import { AboutaComponent } from './components/abouta/abouta.component';
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BlogComponent,
    HomeComponent,
    MarketComponent,
    ContactComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    SettingsComponent,
    PasswordchangeComponent,
    AboutaComponent,
    PasswordforgetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    AuthService,
    BlogService,
    { provide: 'BaseURL', useValue: baseURL },
    ProcessHttpmsgService,
    CommonRoutinesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
