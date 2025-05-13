import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import {SharedModule} from "../shared/shared.module";
import {FreelanceComponent} from "../shared/freelance/freelance.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, ScrollToModule, SharedModule, FreelanceComponent], // ✅ Import the module here
})
export class LayoutComponent { }
