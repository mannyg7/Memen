import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { ArticleComponent } from './article/article.component';
import { AuthComponent } from './auth/auth.component';
import { UserComponent } from './user/user.component';
import { ExploreComponent } from './explore/explore.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', redirectTo: '/landing', pathMatch: 'full'}, {path: 'landing', component: AuthComponent}, {path: 'main', component: MainComponent}, {path: 'profile', component: ProfileComponent}, {path: 'article', component: ArticleComponent}, {path: 'user/:user', component: UserComponent}, {path: 'explore', component: ExploreComponent}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }