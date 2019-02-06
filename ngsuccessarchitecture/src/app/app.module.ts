import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';

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
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';
import { HomewellbeingComponent } from './components/homewellbeing/homewellbeing.component';
import { HomechiComponent } from './components/homechi/homechi.component';
import { HomecampComponent } from './components/homecamp/homecamp.component';
import { HomestudyComponent } from './components/homestudy/homestudy.component';

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
    PasswordforgetComponent,
    HomewellbeingComponent,
    HomechiComponent,
    HomecampComponent,
    HomestudyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    Ng2CarouselamosModule,
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
