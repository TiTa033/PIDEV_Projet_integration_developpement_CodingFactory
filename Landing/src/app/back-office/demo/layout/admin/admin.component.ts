// Angular import
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';

// Project import
import { menus } from 'src/app/back-office/demo/data/menu';
import { LayoutService } from 'src/app/back-office/@theme/services/layout.service';
import { environment } from 'src/environments/environment';
import { FooterComponent } from 'src/app/back-office/@theme/layouts/footer/footer.component';
import { BreadcrumbComponent } from 'src/app/back-office/@theme/layouts/breadcrumb/breadcrumb.component';
import { SharedModule } from '../../shared/shared.module';
import { NavBarComponent } from 'src/app/back-office/@theme/layouts/toolbar/toolbar.component';
import { VerticalMenuComponent } from 'src/app/back-office/@theme/layouts/menu/vertical-menu';

interface Notification {
  type: 'success' | 'warning' | 'error';
  icon: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private layoutService = inject(LayoutService);
  private router = inject(Router);

  // public props
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menus = menus;
  modeValue: 'side' | 'over' = 'side';
  currentApplicationVersion = environment.appVersion;
  pageTitle = 'Dashboard';
  user = {
    name: 'Admin User',
    role: 'Administrator',
    email: 'admin@example.com',
    avatar: 'assets/backoffice/images/default-avatar.png'
  };
  notifications: Notification[] = [];

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
      this.sidenav?.toggle();
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
  }

  private updatePageTitle() {
    const url = this.router.url;
    switch (url) {
      case '/admin/dashboard':
        this.pageTitle = 'Dashboard';
        break;
      case '/admin/payments':
        this.pageTitle = 'Payments';
        break;
      case '/admin/invoices':
        this.pageTitle = 'Invoices';
        break;
      case '/admin/reports':
        this.pageTitle = 'Reports';
        break;
      default:
        this.pageTitle = 'Dashboard';
    }
  }

  logout() {
    // Simple static logout - just navigate to login page
    this.router.navigate(['/auth/login']);
  }
}
