import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'setresponse', loadChildren: './setresponse/setresponse.module#SetresponsePageModule' },
  { path: 'create', loadChildren: './create/create.module#CreatePageModule' },
  { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'edit', loadChildren: './edit/edit.module#EditPageModule' },
  { path: 'splash', loadChildren: './splash/splash.module#SplashPageModule' },
  { path: 'signin', loadChildren: './signin/signin.module#SigninPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'timeline', loadChildren: './timeline/timeline.module#TimelinePageModule' },
  { path: 'addresponse', loadChildren: './addresponse/addresponse.module#AddresponsePageModule' },
  { path: 'userhome', loadChildren: './userhome/userhome.module#UserhomePageModule' },
  { path: 'read', loadChildren: './read/read.module#ReadPageModule' },
  { path: 'work', loadChildren: './work/work.module#WorkPageModule' },
  { path: 'entertainment', loadChildren: './entertainment/entertainment.module#EntertainmentPageModule' },
  { path: 'sleep', loadChildren: './sleep/sleep.module#SleepPageModule' },
  { path: 'eat', loadChildren: './eat/eat.module#EatPageModule' },
  { path: 'walk', loadChildren: './walk/walk.module#WalkPageModule' },
  { path: 'study', loadChildren: './study/study.module#StudyPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
