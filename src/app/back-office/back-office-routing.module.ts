import { AdminComponent } from './demo/layout/admin';
import { EmptyComponent } from './demo/layout/empty';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import {EventComponent} from "./demo/pages/event/event.component";
import {ProjectComponent} from "./demo/pages/project/project.component";
import {PaymentComponent} from "./demo/pages/payment/payment.component";
import {EvaluationComponent} from "./demo/evaluation/evaluation.component";
import {CertificationComponent} from "./demo/certification/certification.component";
import TypographyComponent from "./demo/pages/components/typography/typography.component";

// Route Configuration
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard', // ✅ Fixed redirect (no leading `/`)
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('src/app/back-office/@theme/components/card/candidature-back/candidature-management.component').then(m => m.CandidatureManagementComponent) // ✅ Ensure `default` export
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/pages/components/component.module').then(m => m.ComponentModule)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/pages/other/sample-page/sample-page.component').then(m => m.default) // ✅ Ensure `default` export
      },
      {
        path: 'admin/candidature',
        loadComponent: () => import('src/app/back-office/@theme/components/card/candidature-back/candidature-management.component')
          .then(m => m.CandidatureManagementComponent)
      },
      {path: 'events', component: EventComponent},
      {path: 'projects', component: ProjectComponent},
      {path: 'payments',component:PaymentComponent},
      {path: 'evaluation',component:EvaluationComponent},
      {path: 'certification',component:CertificationComponent},
      {path: 'internships',component: TypographyComponent}

    ]
  },
  {
    path: '',
    component: EmptyComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // ✅ `forChild` instead of `forRoot`
  exports: [RouterModule]
})

export class BackOfficeRoutingModule { }
