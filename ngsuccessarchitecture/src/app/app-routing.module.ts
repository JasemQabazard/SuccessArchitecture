import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { MarketComponent } from './components/market/market.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';
import { HomecampComponent } from './components/homecamp/homecamp.component';
import { HomechiComponent } from './components/homechi/homechi.component';
import { HomewellbeingComponent } from './components/homewellbeing/homewellbeing.component';
import { HomestudyComponent } from './components/homestudy/homestudy.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'camp', component: HomecampComponent},
  {path: 'well', component: HomewellbeingComponent},
  {path: 'chi', component: HomechiComponent},
  {path: 'study', component: HomestudyComponent},
  {path: 'blog', component: BlogComponent},
  {path: 'market', component: MarketComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'passwordchange', component: PasswordchangeComponent},
  {path: 'passwordforget', component: PasswordforgetComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
