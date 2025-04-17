import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Swiper
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Page Route
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';

// Component
import { IndexComponent } from './index/index.component';
import { Index2Component } from './index2/index2.component';
import { Index3Component } from './index3/index3.component';
import { Index4Component } from './index4/index4.component';
import { Index5Component } from './index5/index5.component';
import { Index6Component } from './index6/index6.component';
import { BloglistComponent } from './bloglist/bloglist.component';
import { BlogdetailsComponent } from './blogdetails/blogdetails.component';
import { PricingComponent } from '../shared/pricing/pricing.component';
import { InvoiceCreateComponent } from '../shared/invoice/invoice-create.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    IndexComponent,
    Index2Component,
    Index3Component,
    Index4Component,
    Index5Component,
    Index6Component,
    BloglistComponent,
    BlogdetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    SharedModule,
    SlickCarouselModule,
    MatTableModule,
    PricingComponent,
    InvoiceCreateComponent
  ]
})
export class PagesModule { }
