// Angular imports
import { Component, OnInit, inject, input } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";
import { NgForOf } from '@angular/common';

// Project imports
import { NavigationItem } from 'src/app/back-office/@theme/types/navigation';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuCollapseComponent } from '../menu-collapse/menu-collapse.component';

@Component({
  selector: 'app-menu-group-vertical',
  standalone: true,
  imports: [RouterModule, RouterLink, NgForOf, MenuItemComponent, MenuCollapseComponent], // ✅ Added RouterModule & RouterLink
  templateUrl: './menu-group.component.html',
  styleUrls: ['./menu-group.component.scss']
})
export class MenuGroupVerticalComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);

  // public props
  item = input.required<NavigationItem>();

  // Life cycle events
  ngOnInit() {
    // Activate current link on page reload
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[href='" + current_url + "']";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger', 'active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger', 'active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger', 'active');
      }
    }
  }
}
