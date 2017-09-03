import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from "@angular/http";
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthComponent } from './auth/auth.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


import {AppRoutingModule} from './app.routing';
import { UserComponent } from './user/user.component';
import { ExploreComponent } from './explore/explore.component';
import { PipemodulePipe } from './pipemodule.pipe';
import { SafeurlPipe } from './safeurl.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ProfileComponent,
    AuthComponent,
    UserComponent,
    ExploreComponent,
    PipemodulePipe,
    SafeurlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
