// Angular import
import {Component, OnInit, inject, viewChild, Renderer2} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';

// Project import
import { menus } from 'src/app/back-office/demo/data/menu';
import { LayoutService } from 'src/app/back-office/@theme/services/layout.service';
import { environment } from 'src/environments/environment';
import { FooterComponent } from 'src/app/back-office/@theme/layouts/footer/footer.component';
import { BreadcrumbComponent } from 'src/app/back-office/@theme/layouts/breadcrumb/breadcrumb.component';
import { SharedModule } from '../../shared/shared.module';
import {Router, RouterModule} from '@angular/router';
import { NavBarComponent } from 'src/app/back-office/@theme/layouts/toolbar/toolbar.component';
import { VerticalMenuComponent } from 'src/app/back-office/@theme/layouts/menu/vertical-menu';
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-admin',
  standalone:true,

  imports: [FooterComponent, BreadcrumbComponent, SharedModule, RouterModule, NavBarComponent, VerticalMenuComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private layoutService = inject(LayoutService);
  username: string = ''; // ✅ Store username
  profileImage:string=''
  constructor( private authService: AuthService, private router: Router) { }


  // public props
  sidebar = viewChild<MatDrawer>('sidebar');
  menus = menus;
  modeValue: MatDrawerMode = 'side';
  currentApplicationVersion = environment.appVersion;

  // life cycle event
  ngOnInit() {
    this.breakpointObserver.observe(['(min-width: 1025px)', '(max-width: 1024.98px)']).subscribe((result) => {
      if (result.breakpoints['(max-width: 1024.98px)']) {
        this.modeValue = 'over';
      } else if (result.breakpoints['(min-width: 1025px)']) {
        this.modeValue = 'side';
      }
    });


    this.layoutService.layoutState.subscribe(() => {
      this.sidebar()?.toggle();
    });
  }
  loadUsername(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername; // ✅ Set username if available
    }
  }
  getProfileImage(): string | null {
    return localStorage.getItem('profileImage'); // ✅ Retrieve profile image
  }
}
