// Angular import
import { Component, inject, input } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';

// project import
import { NavigationItem } from 'src/app/back-office/@theme/types/navigation';
import { SharedModule } from 'src/app/back-office/demo/shared/shared.module';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuCollapseComponent } from './menu-collapse/menu-collapse.component';
import { MenuGroupVerticalComponent } from './menu-group/menu-group.component';
import {AuthService} from "../../../../../services/auth.service";
import {CandidatureService} from "../../../../../services/candidature.service";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-vertical-menu',
  standalone:true,
  imports: [SharedModule, MenuItemComponent, MenuCollapseComponent, MenuGroupVerticalComponent, CommonModule],
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss']
})
export class VerticalMenuComponent {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  username:string=''

  // public props
  menus = input.required<NavigationItem[]>();
  profileImage: string=''
  constructor( private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfileImage();
    this.loadUsername();
    const storedImage = this.getProfileImage();
    if (storedImage) {
      this.profileImage = storedImage;
    }
  }
  // public method
  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  accountList = [
    {
      icon: 'ti ti-user',
      title: 'My Account'
    },
    {
      icon: 'ti ti-settings',
      title: 'Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Lock Screen'
    },
    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  loadUsername(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername; // ✅ Set username if available
    }
  }
  getProfileImage(): string | null {
    return localStorage.getItem('profileImage'); // ✅ Retrieve profile image
  }
  loadProfileImage(): void {
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getProfileImage(userId).subscribe({
        next: (imageUrl: string) => {
          this.profileImage = imageUrl;
          localStorage.setItem('profileImage', imageUrl); // ✅ Save for reuse
        },
        error: (err) => {
          console.error('❌ Failed to load profile image:', err);
        }
      });
    }
  }
}
