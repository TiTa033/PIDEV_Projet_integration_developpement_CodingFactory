import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule)
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
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
  imports: [RouterModule.forRoot(routes, { useHash: false })], // Disable hash-based routing
  exports: [RouterModule]
})
export class AppRoutingModule { }
