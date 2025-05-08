import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card" 
         [ngClass]="{
           'card-hover': hover,
           'card-shadow': shadow,
           'card-border': border
         }"
         [class]="cardClass"
         [style.padding.px]="padding">
      <div class="card-header" *ngIf="showHeader">
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() header = false;
  @Input() footer = false;
  @Input() hover = false;
  @Input() shadow = true;
  @Input() border = false;
  @Input() showHeader = true;
  @Input() cardClass = '';
  @Input() padding = 0;
} 