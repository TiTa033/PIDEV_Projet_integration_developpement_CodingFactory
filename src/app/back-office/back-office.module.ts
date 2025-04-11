import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { CandidatureManagementComponent } from './@theme/components/card/candidature-back/candidature-management.component';
import { FilterPipe } from './@theme/components/card/candidature-back/pipe-filter/filter.pipe';


@NgModule({
  declarations: [
    
  
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    
    
    
  ]
})
export class BackOfficeModule { }