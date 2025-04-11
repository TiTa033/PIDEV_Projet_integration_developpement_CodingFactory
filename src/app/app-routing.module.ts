import { NgModule } from '@angular/core';
import { RouterModule, RouterOutlet, Routes, ɵEmptyOutletComponent } from '@angular/router';

// Components
import { LayoutComponent } from 'src/app/layout/layout.component';
import { LoginComponent } from 'src/app/login/login.component';
import { RegisterComponent } from 'src/app/register/register.component';
import { ResetpasswordComponent } from 'src/app/resetpassword/resetpassword.component';

import { AuthGuard } from './guards/auth.guards';
import DashboardComponent from './back-office/demo/pages/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CandidatureManagementComponent } from './back-office/@theme/components/card/candidature-back/candidature-management.component';
import { ProfileComponent } from './pages/profile/profile.component';


 // ✅ Fixed import

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ✅ Ensure login is the default route

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetpasswordComponent },
  { path: 'profile', component: ProfileComponent ,canActivate: [AuthGuard] }, // ✅ Add profile route
  

  {
    path: 'admin',
    loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule),
    canActivate: [AuthGuard] // ✅ Protect admin routes
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // ✅ Protect dashboard
  },
  {
    path: 'home',
    component:SharedModule ,
    canActivate: [AuthGuard] // ✅ Protect dashboard
  },

  {
    path: '**',  // Wildcard route for handling unknown routes
    redirectTo: 'login', // ✅ Redirect unknown routes to login
    pathMatch: 'full'
  },
  { 
    path: 'admin/candidature', 
    loadComponent: () => import('src/app/back-office/@theme/components/card/candidature-back/candidature-management.component')
      .then(m => m.CandidatureManagementComponent) 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })], // Hash-based routing enabled
  exports: [RouterModule]
})
export class AppRoutingModule {}
