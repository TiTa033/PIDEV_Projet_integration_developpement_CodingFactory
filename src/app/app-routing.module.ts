import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import {ProfileComponent} from "./pages/profile/profile.component";
import {AuthGuard} from "./guards/auth.guards";
import DashboardComponent from "./back-office/demo/pages/dashboard/dashboard.component";
import {UploadStudentIdComponent} from "./shared/upload-student-id/upload-student-id.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  { path: 'profile', component: ProfileComponent ,canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/candidature', loadComponent: () => import('src/app/back-office/@theme/components/card/candidature-back/candidature-management.component').then(m => m.CandidatureManagementComponent) },
  { path: 'uploadstudentcardimage', component: UploadStudentIdComponent },


  {
    path: 'admin',
    loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'reset-password',
    component: ResetpasswordComponent
  },
  {
    path: '**',  // Wildcard route for handling unknown routes
    redirectTo: '', // Redirect unknown routes to the home page (Change if needed)
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // Hash-based routing enabled
  exports: [RouterModule]
})
export class AppRoutingModule { }
